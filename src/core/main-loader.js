import Loadable from "@ips/app/loadable-vjs";
// const Spinner = ()=><div>Loading....</div>
// import Spinner from './gooey-spinner-vjs'
import app from "@ips/app/app";

import { preloader } from "./preloader";
import initStrapi from '@ips/strapi/client';
import tmStrapiData from '@/utils/tmStrapiData'
import loadJson from '@ips/app/loadJson'
import loadText from '@ips/app/loadText'

import initFonts from '../fonts'

import content from '../content'

// window.__ips_public_path__ = window.__ips_public_path__ || app.publicPath || '/'

// import * as Critical from './critical'
// import keen from './utils/keen'

const ensureEndSlash = (s) => (s[s.length - 1] == "/" ? s : s + "/");

export default {
  render: Loadable({
    // prerender: Spinner,
    prerender: (container, opts) => {
      // trace("Container:", container);
      preloader.show(container);

    },
    loader: async (container, opts) => {
      try {

        const searchLocale = new URLSearchParams(opts.searchParams).get('l')
        trace('search locale:', searchLocale)

        const loadData = (async()=>{

          const cfgName = (__BUILD_MODE__ == "production") ? "config.prod" : "config"

          const dataConfig = await loadJson(`${app.publicPath}/${cfgName}.json`)
          const locale = searchLocale || dataConfig.locale || 'ru'
          trace('locale:', locale)
          opts.locale = locale

          return content
          
          // if(dataConfig.mode == 'local'){
          //   const result = await loadJson(`${app.publicPath}/data-${locale}.json`)
          //   // trace(result)
          //   return result
          // }else
          // if(dataConfig.mode == 'strapi'){
          //   const dataq = await loadText('data.gql')
          //   const strapi = initStrapi(dataConfig.backURI)
          //   let result = await strapi.getData(dataq, { locale })
          //   trace('got raw data', result)
          //   // result.locale = locale
          //   result = tmStrapiData(result)
          //   result.config = dataConfig
          //   return result
          // }else{
          //   error('confg.json error: mode=(local|strapi)')
          //   return {}
          // }

          // cb(result)
        })

        const dataPromise = loadData()

        function onLoadChunk(event) {
          // console.log("RESOURCES", event.detail.resource.url);
          preloader.setProgress(event.detail.loaded, event.detail.total);
          //   event.detail.loaded; // total bytes loaded
          //   event.detail.total; // total bytes requested
          //   (event.detail.loaded / event.detail.total) * 10 * 100; // total progress percentage
          //   const resource = event.detail.resource; // info about resource that triggered the event
          //   resource.loaded;
          //   resource.total;
          //   resource.url;
          //   console.log("EVENT DETAIL", event.detail);
          //   console.log("EVENT Total", event.detail.total);
        }

        document.addEventListener("chunk-progress-webpack-plugin", onLoadChunk);
        // trace('app.publicPath', app.publicPath)
        // trace('__ips_public_path__', __ips_public_path__)
        // trace('__webpack_public_path__ 0', __webpack_public_path__)
        __webpack_public_path__ = ensureEndSlash(
          app.publicPath || __webpack_public_path__
        );
        // keen.set({
        //     publicPath: app.publicPath,
        //     __webpack_public_path__
        // })
        // keen.log('loader')

        initFonts(app.publicPath)
        
        const mainBundlePromise = import(
          /* webpackChunkName: "main" */ "./main-bundle"
        );
        // trace('__webpack_public_path__ 1', __webpack_public_path__)
        // trace("mainBundlePromise", mainBundlePromise);

        const [res, data] = await Promise.all([mainBundlePromise, dataPromise]);

        preloader.setProgress(100, 100);
        preloader.hide();
        document.removeEventListener(
          "chunk-progress-webpack-plugin",
          onLoadChunk
        );
        //trace("res", res);
        const MainBundle = res.default;
        // trace('MainBundle', MainBundle)
        const MainCompo = await MainBundle.init({data});
        // trace('MainCompo', MainCompo)

        return MainCompo;
      } catch (err) {
        // trace('data error')
        error(err);
        // keen.error(err)
      }
    },
    render(Loaded, container, opts) {
      //trace("loadable render with props", Loaded, container, opts);
      // let Component = loaded
      return Loaded(container, {...opts, preloader});
    },
  }),
};
