const process = require("process");
const path = require("path");
const webpack = require("webpack");
const { ESBuildMinifyPlugin } = require("esbuild-loader");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ChunkProgressWebpackPlugin = require("chunk-progress-webpack-plugin");
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const CopyPlugin = require("copy-webpack-plugin");

const prj = require("../project.json");
const pkg = require("../package.json");

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

const configure = (config, { mode }) => {
  const cwd = process.cwd();
  // const env = process.env;

  config = config||{}
  config.locale = config.locale||'ru'
  config.mode = mode||'production'
  config.entry = config.entry||'all'
  config.analyze = config.analyze||false
  config.compiler = config.compiler||'esbuild'
  console.log('config', config)

  var analyzerPort = 12000+(hashCode(prj.name||'none')%1000)
  if(config.analyze)
    console.log('analyzerPort', analyzerPort)

  const NODE_MODULES = path.resolve(cwd, "node_modules");
  const SRC = path.resolve(cwd, "src");
  const IPS_PACKAGES = path.resolve(cwd, "node_modules/@ips");
  const IPS_PACKAGES_REACT = path.join(IPS_PACKAGES, 'react');
  const IPS_PACKAGES_APP = path.join(IPS_PACKAGES, 'app');
  // const ASSET_PATH = path.resolve(cwd, 'assets')//process.env.ASSET_PATH || '/';
  var modulesDirs = [SRC, IPS_PACKAGES_APP, IPS_PACKAGES_REACT, IPS_PACKAGES, NODE_MODULES];

  // console.log('modulesDirs', modulesDirs)

  const targets = [
    "es2020",
    "chrome63",
    "firefox67",
    "safari12",
    "edge79",
    // 'node12',
  ];

  const tplConfig = {
    inject: false, //'body',//'head',
    template: "src/core/index.ejs", // default
    lang: prj.lang,
    title: prj.title,
    excludeChunks: ["lame", "main", "inject", "critical", "index"],
    meta: {
      viewport:
        "width=device-width, initial-scale=1.0, minimum-scale=1.0, user-scalable=no",
      author: "IPS",
      type: "article",
      "fb:app_id": "501403387024620",
      title: prj.title,
      description: prj.description,
      "og:type": "article",
      "og:locale": prj.locale,
      "og:title": prj.title,
      "og:description": prj.description,
      "og:url": prj.url,
      "og:image": prj.image,
      "ria:title": prj.riaTitle,
      "ria:description": prj.riaDescription,
      "ria:image": prj.riaImage,
      "ria:widgetButton": prj.widgetButton,
      "ria:image1x1": prj.riaImage1x1,
      "metrika:id": prj.metrikaId || 52449085,
    },
    scripts: [
      // 'https://dc.ria.ru/ips/social-extract.js',
      // 'https://dc.ria.ru/ips/ria-topline.js',
    ],
    //     headHtmlSnippet:`
    //   <script>
    //       // Support lame browsers
    //       (function(){
    //           function appendScript(url){
    //               console.log('appendScript', url);
    //               var s = document.createElement( 'script' );
    //               s.src = url;
    //               document.head.appendChild( s );
    //
    //           }
    //
    //           if('undefined' != typeof document.documentMode // IE
    //               // || /^((?!chrome|android).)*safari/i.test(navigator.userAgent) // Safari
    //           ){
    //               ['https://dc.ria.ru/ips/lib/web-animations.min.js',
    //               'https://dc.ria.ru/ips/lame.js']
    //                   .forEach(appendScript);
    //           }
    //       })()
    //   </script>`,
    chunks: false,
  };
  const indexConfig = { ...tplConfig };
  indexConfig.filename = "index.html";
  indexConfig.scripts = tplConfig.scripts.concat(["index.js"]);

  const ientry = config.mode == 'development' ? 
    { import: ["index", "dev"], filename: "[name].js" } : 
    { import: "index", filename: "[name].js" }

  const jsLoaders = config.compiler == 'babel' ? [{
    test: /\.(?:js|es).?$/,
    // test:/\.js$/,
    loader: 'babel-loader',
    // exclude: /node_modules/,
    options: {
      plugins: [],
      presets: ['@babel/preset-env', '@babel/preset-react'],
    }
  },
  {
    test: /\.(?:js|es).?$/,
    // test:/\.js$/,
    loader: 'babel-loader',
    include: [IPS_PACKAGES],
    // exclude: /node_modules/,
    options: {
      plugins: [],
      presets: ['@babel/preset-env', '@babel/preset-react'],
    }
  }]
  : 
  [{
    test: /\.js$/,
    // test:/\.js$/,
    loader: "esbuild-loader",
    options: {
      loader: "jsx",
      target: targets,
      define: {
        __BUILD_LOCALE__: '"ru"',
        __BUILD_MODE__: `"${config.mode}"`,
      },
    },
    resolve: {
      fullySpecified: false,
    },
    // include: [SRC, IPS_PACKAGES],
  }]


  const out = {
    mode: "production",
    entry: {
      index: ientry,
      inject: ientry,
    },
    resolve: {
      extensions: [".js", ".jsx", ".ts", ".tsx", ".json", ".wasm"],
      modules: modulesDirs,
      symlinks: true,
      alias: {
        "@": path.resolve(cwd, 'src'),
        "@ips": path.resolve(cwd, 'src/@ips'),
      }
    },
    module: {
      rules: [
        ...jsLoaders,
        {
          test: /\.css$/,
          use: ["style-loader", "css-loader" /*'postcss-loader'*/],
        },

        {
          test: /\.styl$/,
          use: [
            "style-loader",
            "css-loader",
            {
              loader: "stylus-loader",
              options: {
                stylusOptions: {
                  paths: modulesDirs,
                },
              },
            },
          ],
        },
        { test: /\.ya?ml$/, use: [ 'json-loader', 'yaml-loader'] },
        // { test: /\.(woff|woff2|eot|ttf)$/, use: {
        //     loader: 'url-loader',
        //     options: {
        //       limit: '100000'
        //     }
        //   }
        // },
        {
          test: /\.svg$/,
          use: [{
            loader: '@svgr/webpack',
            options: {
              svgo: false,
            }
          }],
        },
        { test: /\.gql$/i, use: 'raw-loader' },        
      ],
    },
    output: {
      clean: true,
      iife: true,
      publicPath: '',
      path: path.join(cwd, "build"),
    },
    plugins: [
      new HtmlWebpackPlugin(indexConfig),
      new ChunkProgressWebpackPlugin(),
    ],
    optimization: {
    },
    devServer: {
      static: {
        directory: path.join(cwd, "assets"),
      },
      client: {
        overlay: false,
      },
      compress: true,
      port: pkg.devPort || 9000,
    },
  };

  out.plugins.push(
    new CopyPlugin({
      patterns: [
        { from: "assets", to: "" },
      ],
    }),    
  )

  if(config.analyze){
    out.plugins.push(new BundleAnalyzerPlugin({ analyzerPort: analyzerPort, openAnalyzer:true }))
    // out.devtool = 'inline-source-map'
  }

  if(!config.analyze){
    out.optimization.minimizer = [
        new ESBuildMinifyPlugin({
          target: targets, // Syntax to compile to (see options below for possible values)
        }),
      ]
  }
  if(config.compiler == 'babel'){
    out.plugins.push(
      new webpack.DefinePlugin({
        __BUILD_LOCALE__: `"${config.locale}"`,
        __BUILD_MODE__: `"${config.mode}"`,
      }))
  }


  return out

};

module.exports = configure;
