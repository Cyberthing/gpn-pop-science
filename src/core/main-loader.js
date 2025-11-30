import Loadable from "@ips/app/loadable-vjs";
import app from "@ips/app/app";
import { loadScriptCb } from '@ips/app/utils.js'

import { preloader } from "./preloader";
import loadJson from '@ips/app/loadJson'
import loadText from '@ips/app/loadText'

import initFonts from '../fonts'

import content from '../content'

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

        await loadScriptCb('https://vk.com/js/api/videoplayer.js', ()=>{})

        const searchLocale = new URLSearchParams(opts.searchParams).get('l')
        trace('search locale:', searchLocale)

        const loadData = (async()=>{
          const cfgName = (__BUILD_MODE__ == "production") ? "config.prod" : "config"
          const dataConfig = await loadJson(`${app.publicPath}/${cfgName}.json`)
          const locale = searchLocale || dataConfig.locale || 'ru'
          trace('locale:', locale)
          opts.locale = locale
          return content
        })

        const dataPromise = loadData()

        function onLoadChunk(event) {
          preloader.setProgress(event.detail.loaded, event.detail.total);
        }

        document.addEventListener("chunk-progress-webpack-plugin", onLoadChunk);
        // trace('app.publicPath', app.publicPath)
        __webpack_public_path__ = ensureEndSlash(
          app.publicPath || __webpack_public_path__
        );

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
