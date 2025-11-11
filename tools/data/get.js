"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// src/get.js
var import_fs = __toESM(require("fs"));
var import_path = __toESM(require("path"));
var import_process = __toESM(require("process"));

// ../../src/@ips/app/trace.js
var w = typeof window != "undefined" ? window : global;
if (console && console.log) {
  w.info = console.log.bind(w.console);
  w.trace = console.log.bind(w.console);
  w.warn = console.warn.bind(w.console);
  w.error = console.error.bind(w.console);
} else {
  w.info = w.trace = w.warn = w.error = function() {
  };
  if (!w.console) w.console = {};
  if (!w.console.log) w.console.log = function() {
  };
}

// ../../src/@ips/strapi/client.js
var import_client = require("@apollo/client");

// ../../src/@ips/strapi/locales.gql
var locales_default = "query { i18NLocales(pagination:{limit:100}) { data { id, attributes { name, code } } } }";

// ../../src/@ips/strapi/rtl.js
var rtl_default = [
  "ar",
  "fa",
  "fa-AF"
];

// ../../src/@ips/strapi/client.js
var initStrapi = (uri) => {
  let client = new import_client.ApolloClient({
    uri,
    cache: new import_client.InMemoryCache()
  });
  const getData = async (q, variables) => {
    const query = (0, import_client.gql)(q);
    const result = await client.query({
      query,
      variables
    });
    return result.data;
  };
  const getLocales = async () => {
    const res = await getData(locales_default);
    return res.i18NLocales?.data?.map((d) => d.attributes).map(({ __typename, ...p }) => ({ ...p, rtl: !!rtl_default[p.code] }));
  };
  return {
    getLocales,
    getData
  };
};
var client_default = initStrapi;

// ../../src/@ips/app/hidash.js
var ud = (o) => typeof o === "undefined";
var isObject = (o) => typeof o === "object" && o !== null;
var isArray = (o) => Array.isArray(o);

// ../../src/@ips/strapi/mediaMime.js
var MT = {
  Image: "image",
  Video: "video",
  Data: "data"
};
var MediaTypes = {
  "jpg": MT.Image,
  "jpeg": MT.Image,
  "png": MT.Image,
  "apng": MT.Image,
  "gif": MT.Image,
  "svg": MT.Image,
  "mp4": MT.Video,
  "webm": MT.Video,
  "json": MT.Data
};
var ExtToExt = {
  "jpg": "jpeg",
  "jpeg": "jpeg",
  "png": "png",
  "apng": "apng",
  "gif": "gif",
  "svg": "svg",
  "mp4": "mp4",
  "webm": "webm"
};
var mediaUrlToType = (m) => MediaTypes[m.split(".").pop().toLowerCase()];
var mediaUrlToMime = (m) => {
  const ext = m.split(".").pop().toLowerCase();
  return MediaTypes[ext] + "/" + ExtToExt[ext];
};

// ../../src/@ips/strapi/data.js
var undatt = (d) => d?.data?.attributes;
var undarr = (d) => d?.data.map((dd) => dd.attributes);
var unref = (d) => undatt(d.ref);
var isref = (d) => d.__typename && d.__typename.startsWith("ComponentRefs");
var isdatt = (d) => !!d?.data?.attributes;
var isdarr = (d) => isArray(d?.data);
var reImg = /<img\s+[^>]*>/g;
var reParams = /([\w-]+)\s*="([\w\-\.\/\s]*)"/g;
var getAllMatches = (s, rre) => {
  const re = new RegExp(rre);
  const r = [];
  let m;
  while (m = re.exec(s)) {
    r.push(m);
  }
  return r;
};
var createImgMedia = (params) => {
  const src = params.find((p) => p[0] == "src")?.[1];
  return {
    __typename: "UploadFile",
    url: src,
    basename: src.split(".")[0],
    width: params.find((p) => p[0] == "width")?.[1],
    height: params.find((p) => p[0] == "height")?.[1],
    mime: mediaUrlToMime(src)
  };
};
var travFix = (d) => {
  if (ud(d) || null == d)
    return d;
  if (isref(d)) {
    d = unref(d);
  }
  if (isArray(d))
    return travArr(d);
  if (isObject(d))
    return travObj(d);
  return d;
};
var travArr = (d) => d.map(travFix);
var travObj = (d) => {
  const o = {};
  Object.keys(d).forEach((k) => {
    if (isdatt(d[k]))
      o[k] = undatt(d[k]);
    else if (isdarr(d[k]))
      o[k] = undarr(d[k]);
    else o[k] = d[k];
  });
  const oo = {};
  Object.keys(o).forEach((k) => {
    oo[k] = travFix(o[k]);
  });
  return oo;
};
var trav = (d, pred) => {
  if (pred(d))
    return;
  const trapred = (d2) => trav(d2, pred);
  if (isArray(d))
    d.forEach(trapred);
  if (isObject(d)) {
    Object.values(d).forEach(trapred);
  }
};
var tmData = (data) => {
  return travObj(data);
};
var tmMedia = (data, opts = {}) => {
  const { parseMediaFields } = opts;
  trav(data, (o) => {
    if (!o)
      return;
    if (o.__typename == "UploadFile") {
      if (!o.serverUrl) {
        o.serverUrl = o.url;
        const surl = o.url.split("/");
        o.url = surl.pop();
        o.basename = o.url.split(".")[0];
      }
      return true;
    }
    const mfields = parseMediaFields && parseMediaFields(o);
    if (mfields && mfields.length) {
      if (!o.mediaMap) {
        o.mediaMap = {};
        mfields.forEach((mfield) => {
          const simgs = getAllMatches(o[mfield], reImg).map((v) => v[0]);
          if (simgs.length) {
            simgs.forEach((simg) => {
              const params = getAllMatches(simg, reParams).map((v) => [v[1], v[2]]);
              const media = createImgMedia(params);
              media.serverUrl = media.url;
              media.url = media.url.split("/").pop();
              o.mediaMap[media.url] = media;
              o[mfield] = o[mfield].replace(media.serverUrl, media.url);
              const srcset = params.find((p) => p[0] == "srcset")?.[1];
              if (srcset)
                o[mfield] = o[mfield].replace(srcset, "");
            });
          }
        });
      }
    }
  });
  return data;
};
var collectMedia = (data, mediaMap = {}) => {
  trav(data, (o) => {
    if (!o) return;
    if (o.__typename == "UploadFile") {
      mediaMap[o.url] = o;
      return true;
    }
    return false;
  });
  return mediaMap;
};

// ../../src/utils/tmStrapiData.js
var tmStrapiData = (data) => {
  data = tmData(data);
  data = tmMedia(data, {
    // parseMediaFields:o=>{
    //   if(o.__typename == 'ComponentElementsBodyText')
    //     return ['text']
    // }
  });
  return data;
};
var tmStrapiData_default = tmStrapiData;

// ../../src/@ips/strapi/download.js
var import_child_process = require("child_process");
var userAgent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.0.0 Safari/537.36";
var downloadFile = (output, url) => new Promise((resolve, reject) => {
  let cmd = `wget --user-agent="${userAgent}" --no-check-certificate --no-verbose -O "${output}" "${url}"`;
  let child = (0, import_child_process.exec)(cmd, function(error, stdout, stderr) {
    console.log("stdout: " + stdout);
    console.log("stderr: " + stderr);
    if (error) {
      reject(error);
    } else {
      resolve(output);
    }
  });
});

// src/get.js
var assetpath = "../../assets";
var imgpath = "../../assets/img";
var videopath = "../../assets/media";
var datapath = "../../assets";
var tmpPath = import_path.default.join(__dirname, "tmp");
var setUp = () => {
  try {
    import_fs.default.mkdirSync(tmpPath);
  } catch (err) {
    if (err && err.code != "EEXIST") {
      return console.error(err);
    }
  }
};
(async () => {
  setUp();
  const config = JSON.parse(import_fs.default.readFileSync(`${assetpath}/config.json`, "utf-8"));
  let locales = import_process.default.argv.slice(2);
  if (!locales.length)
    locales.push(config.locale);
  const serverUrl = "http:" + config.backURI;
  const strapi = client_default(serverUrl);
  if (locales[0] == "all") {
    trace("getting locale list");
    locales = await strapi.getLocales();
    locales = locales.map((l) => l.code);
  }
  trace("locales", locales);
  const mediaMap = {};
  const q = import_fs.default.readFileSync("../../assets/data.gql", "utf-8");
  await Promise.all(locales.map(async (locale) => {
    let result = await strapi.getData(q, { locale });
    result = tmStrapiData_default(result);
    collectMedia(result, mediaMap);
    import_fs.default.writeFileSync(`${assetpath}/data-${locale}.json`, JSON.stringify(result, null, " "));
  }));
  trace("media", Object.keys(mediaMap));
  const mediaProms = Object.values(mediaMap).map((v) => {
    try {
      return downloadFile(import_path.default.join(tmpPath, import_path.default.basename(v.url)), new URL(v.serverUrl, serverUrl).toString());
    } catch (err) {
      console.log(err);
    }
  });
  const files = await Promise.all(mediaProms);
  const cfiles = await Promise.all(files.map((f) => new Promise((resolve, reject) => {
    const type = mediaUrlToType(f);
    const ppath = type == "image" ? imgpath : type == "video" ? videopath : type == "data" ? datapath : assetpath;
    const target = import_path.default.join(ppath, import_path.default.basename(f));
    import_fs.default.copyFile(f, target, (err) => {
      if (err) {
        console.error(err);
        reject();
      } else {
        resolve(target);
      }
    });
  })));
  trace("done");
})();
