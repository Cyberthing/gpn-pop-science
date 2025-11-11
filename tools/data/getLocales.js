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

// src/getLocales.js
var import_fs = __toESM(require("fs"));

// ../../node_modules/@ips/strapi/client.js
var import_client = require("@apollo/client");

// ../../node_modules/@ips/strapi/locales.gql
var locales_default = "query { i18NLocales(pagination:{limit:100}) { data { id, attributes { name, code } } } }";

// ../../node_modules/@ips/strapi/rtl.js
var rtl_default = [
  "ar",
  "fa",
  "fa-AF"
];

// ../../node_modules/@ips/strapi/client.js
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

// src/getLocales.js
var assetpath = "../../assets";
(async () => {
  const config = JSON.parse(import_fs.default.readFileSync(`${assetpath}/config.json`, "utf-8"));
  const serverUrl = "http:" + config.backURI;
  const strapi = client_default(serverUrl);
  const locales = await strapi.getLocales();
  import_fs.default.writeFileSync(`${assetpath}/locales.json`, JSON.stringify(locales, null, " "));
})();
