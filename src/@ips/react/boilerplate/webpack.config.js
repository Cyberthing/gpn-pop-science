var webpack = require('webpack')
var BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
// const WebpackBabelExternalsPlugin = require('webpack-babel-external-helpers-2');
var LodashModuleReplacementPlugin = require('lodash-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin')

var path = require('path');
var url = require('url');

const NODE_MODULES = path.resolve(__dirname, 'node_modules')
const IPS_PACKAGES = path.resolve(__dirname, 'node_modules/@ips')
const IPS_PACKAGES_REACT = path.join(IPS_PACKAGES, 'react')
const IPS_PACKAGES_APP = path.join(IPS_PACKAGES, 'APP')
const SRC = path.resolve(__dirname, 'src')

const ASSET_PATH = path.resolve(__dirname, 'assets')//process.env.ASSET_PATH || '/';

//var fontDir = path.resolve(__dirname, '../common')

// var upDir = path.resolve(__dirname, '..');
console.log('NODE_MODULES', NODE_MODULES)
// console.log('upDir', upDir)

var babelPlugins = {
  dynamicImport:path.resolve(NODE_MODULES, '@babel/plugin-syntax-dynamic-import'),
  async2gen:path.resolve(NODE_MODULES,'@babel/plugin-transform-async-to-generator'),
  jsx:path.resolve(NODE_MODULES,'@babel/plugin-transform-react-jsx'),
  lodash:path.resolve(NODE_MODULES, 'babel-plugin-lodash'),
  restSpread:path.resolve(NODE_MODULES, '@babel/plugin-proposal-object-rest-spread'),
  classProperties:path.resolve(NODE_MODULES, '@babel/plugin-proposal-class-properties'),
  // reactCssModules:path.resolve(NODE_MODULES, 'babel-plugin-react-css-modules')
}
var presets = ['@babel/preset-env', '@babel/preset-react'].map(require.resolve);

var extensions = [ '.js', '.jsx','.es6','.styl','.css'] 

var hashCode = function(s) {
  var hash = 0, i, chr;
  if (s.length === 0) return hash;
  for (i = 0; i < s.length; i++) {
    chr   = s.charCodeAt(i);
    hash  = ((hash << 5) - hash) + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
};

const __times = (c, f) => (Array.from({length: c}, (_,x) => f(x)))
module.exports = env => {

  env = env||{}
  env.locale = env.locale||'ru'
  env.build = env.build||'production'
  env.entry = env.entry||'all'

  const isProduction = env.build === 'production'

  console.log('env', env)  
  const SRC_LOCALE = path.resolve(SRC, env.locale)

  var modulesDirs = [
    SRC,
    SRC_LOCALE,
    IPS_PACKAGES_REACT, 
    IPS_PACKAGES_APP, 
    path.resolve(__dirname, 'src/content'),
    // path.resolve(__dirname, 'assets'),
    NODE_MODULES]

  var outPath = (!isProduction) ? 
    (path.resolve(__dirname, 'build-dev')) :
    (path.resolve(__dirname, 'build' + (env.locale != 'ru' ? ('-' + env.locale):'')))

  console.log('outPath', outPath)


  const prj = require('./project.json')[env.locale]
  // fix missing prj fields
  prj.title = prj.title||'[???]';
  prj.description = prj.description||'[???]';
  prj.riaTitle = prj.riaTitle||prj.title||'[???]';
  prj.riaDescription = prj.riaDescription||prj.description||'[???]';
  prj.lang = prj.lang||'ru'
  prj.locale = prj.locale||'ru_RU'

  var analyzerPort = 12000+(hashCode(prj.name||'none')%1000)
  console.log('analyzerPort', analyzerPort)

  // var lamePolyfills = [
  //   "es6-promise/dist/es6-promise.auto.js", 
  //   "babel-polyfill",
  //   "intersection-observer",
  //   // "web-animations-js",
  //   '@ips/app/matches',
  //   "@ips/react/components/lib/stickyfilljs/stickyfill", 
  //   ]
  //     .map(require.resolve);

  const tplConfig = {
    inject:false,//'body',//'head',
    template:'src/index.ejs', // default
    lang:prj.lang,
    title:prj.title,
    excludeChunks:['lame','main','inject','critical','index'],
    meta:{
      'viewport':'width=device-width, initial-scale=1.0, minimum-scale=1.0, user-scalable=no',
      'author':'IPS',
      'type':'article',
      'fb:app_id':'501403387024620',
      'title':prj.title,
      'description':prj.description,
      'og:type':'article',
      'og:locale':prj.locale,
      'og:title':prj.title,
      'og:description':prj.description,
      'og:url':prj.url,
      'og:image':prj.image,
      'ria:title':prj.riaTitle,
      'ria:description':prj.riaDescription,
      'ria:image':prj.riaImage,
      'ria:widgetButton':prj.widgetButton,
      'ria:image1x1':prj.riaImage1x1,
      'metrika:id':prj.metrikaId || 52449085,
    },
    scripts:[
      // 'https://dc.ria.ru/ips/social-extract.js',
      // 'https://dc.ria.ru/ips/ria-topline.js',
    ],
    headHtmlSnippet:`
  <script>
      // Support lame browsers
      (function(){
          function appendScript(url){
              console.log('appendScript', url);
              var s = document.createElement( 'script' );
              s.src = url;
              document.head.appendChild( s );

          }

          if('undefined' != typeof document.documentMode // IE
              // || /^((?!chrome|android).)*safari/i.test(navigator.userAgent) // Safari
          ){ 
              ['https://dc.ria.ru/ips/lib/web-animations.min.js', 
              'https://dc.ria.ru/ips/lame.js']
                  .forEach(appendScript);
          }
      })()
  </script>`,
    chunks:false,
  }

  const indexConfig = { ...tplConfig }
  indexConfig.filename = 'index.html'
  indexConfig.scripts = tplConfig.scripts.concat(['index.js'])

  const injectConfig = { ...tplConfig }
  injectConfig.filename = 'inject.html'
  injectConfig.scripts = tplConfig.scripts.concat(['inject.js'])

  const criticalConfig = { ...tplConfig }
  criticalConfig.filename = 'critical.html'
  criticalConfig.headHtmlSnippet=null
  criticalConfig.meta = {}
  criticalConfig.scripts = []
  criticalConfig.scripts = criticalConfig.scripts.concat(['critical.js'])


  const edev = ['./src/dev.js', 'regenerator-runtime/runtime', './src/index.js']
  const eindex = ['regenerator-runtime/runtime', './src/index.js']
  const einject = ['regenerator-runtime/runtime', './src/inject.js']
  const ecritical = ['regenerator-runtime/runtime', './src/index-critical.js']
  const entries = {}
  if('dev' == env.entry){
      entries.index = edev
  }
  if('all' == env.entry || 'index' == env.entry){
      entries.index = eindex
  }
  if('all' == env.entry || 'inject' == env.entry){
      entries.inject = einject
  }
  if('all' == env.entry || 'critical' == env.entry){
      entries.critical = ecritical
  }

  const config = {
    entry:entries,
    resolve: {
      modules:modulesDirs,
      extensions: extensions,
      enforceExtension:false
    },    
    resolveLoader: {
      //modules:,
      extensions: extensions
    },  
    output: {
      path: outPath,
      filename: '[name].js',
      chunkFilename: '[name].js',
      pathinfo:!isProduction,
      // publicPath:'/',
    },
    devServer:{
        contentBase: ASSET_PATH,
        // inline: true,
        // host: '0.0.0.0',
        // port: 8080,        
    },
    module: {
      rules: [
        {
          test: /\.(?:js|es).?$/,
          // test:/\.js$/,
          loader: 'babel-loader',
          // exclude: /node_modules/,
          query: {
            plugins: [
              babelPlugins.dynamicImport,
              babelPlugins.lodash,
              babelPlugins.restSpread,
              babelPlugins.classProperties,
              babelPlugins.async2gen,
              babelPlugins.jsx,
              // babelPlugins.reactCssModules,
              // [ // preact thing
              //   transforms.jsx, 
              //   { "pragma":"h" }
              // ]
            ],
            presets: presets
          }
        },
        {
          test: /\.(?:js|es).?$/,
          // test:/\.js$/,
          loader: 'babel-loader',
          include: [IPS_PACKAGES],
          query: {
            plugins: [
              babelPlugins.dynamicImport,
              babelPlugins.lodash,
              babelPlugins.restSpread,
              babelPlugins.classProperties,
              babelPlugins.async2gen,
              babelPlugins.jsx,
              // babelPlugins.reactCssModules,
              // [ // preact thing
              //   transforms.jsx, 
              //   { "pragma":"h" }
              // ]
            ],
            presets: presets
          }
        },      
        // { test: /\.json$/, loader: 'json-loader' },
        { test: /\.ya?ml$/, loaders: [ 'json-loader', 'yaml-loader'] },
        { test: /\.css$/, loaders: [ 'style-loader', 'css-loader', /*'postcss-loader'*/ ] },
        { test: /\.styl$/, 
          loaders: [ 
          'style-loader', 
          {
            loader:'css-loader', 
            // options:{
            //   importLoader:1,
            //   modules:false,
            //   // localIdentName:'[path]___[name]__[local]___[hash:base64:5]',
            //   url:false,
            //   // root:'.',
            //   // alias:{
            //   //   '/fonts':'./fonts'
            //   // }
            // }
          },
          {
            loader:'stylus-loader',
            options:{
              paths:modulesDirs,
            }

          } ] },
      ]
    },          
    plugins:[
  	  // new webpack.optimize.UglifyJsPlugin()
      // new webpack.IgnorePlugin(/uglify-js/)
      new webpack.DefinePlugin({
        '__BUILD_LOCALE__': `"${env.locale||'ru'}"`,
      }),
      new LodashModuleReplacementPlugin({
        'collections': true,
        'shorthands': true,
        'currying': true,
        'placeholders': true      
      }),
      new HtmlWebpackPlugin(indexConfig),
      new HtmlWebpackPlugin(injectConfig),
      new HtmlWebpackPlugin(criticalConfig),
      // new HtmlWebpackPlugin(injextConfig),
      // ...(sharers.map(s=>new HtmlWebpackPlugin(s)))
      // extractCSS,
      // new WebpackBabelExternalsPlugin(),

    ]

  }

  if(env.analyze)
    config.plugins.push(
      new BundleAnalyzerPlugin({
        analyzerPort: analyzerPort,
        openAnalyzer:true
      })
    )

  return config

}