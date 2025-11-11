import "./core/polyfills";
import "@ips/app/trace";
// import '@ips/app/normalize.css'
import "@ips/app/modernizr";
// import sizer from '@ips/app/sizer'
import "./global.css";
// import './fonts.styl'

// import { loadScriptCb } from '@ips/app/utils'

import app from "@ips/app/app";
import * as analytics from "@ips/app/google-tag-manager";
import appInject from "@ips/app/app-inject";
import * as Metrika from "@ips/app/metrika";
import ml from "./core/main-loader";

const locale = __BUILD_LOCALE__;

const prj = require("../project.json"); //[locale]
app.projectName = prj.name;
app.title = prj.title;
app.appMode = "longread";

analytics.connect(app);
analytics.event("entrance");

const inopts = {
  project: prj.name,
  scriptName: "index.js",
  title: prj.title,
  desc: prj.description,
  url: prj.url,
  YMID: prj.YMID,
};

// trace('render', ml)

const doInject = () => {
  appInject((container, opts) => {
    opts.mode = "longread";

    Metrika.init(opts);
    Metrika.event("entrance");

    app.publicPath = opts.publicPath;
    // app.mediaPath = opts.hostRia?('https://cdndc.img.' + opts.publicPath.split('https://')[1]):opts.publicPath

    // sizer(null, null, opts)

    ml.render(container, opts);
  }, inopts);
};

doInject();
