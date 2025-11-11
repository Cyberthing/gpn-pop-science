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

// src/cleanupData.js
var import_promises = __toESM(require("fs/promises"));
var import_path = __toESM(require("path"));
var tableFiles = ["d1", "d2", "d3", "d4"];
var tabFiles = ["t1", "t2", "t3", "t4"];
var srcPath = "./tables";
var destPath = "../../src/data";
var tableColumns = [
  "\u041C\u0435\u0441\u0442\u043E",
  "\u041D\u0430\u0437\u0432\u0430\u043D\u0438\u0435 \u043A\u043E\u043C\u043F\u0430\u043D\u0438\u0438",
  "\u0420\u0435\u0433\u0438\u043E\u043D",
  "\u041E\u0442\u0440\u0430\u0441\u043B\u044C",
  "\u0418\u0442\u043E\u0433\u043E\u0432\u044B\u0439 \u0431\u0430\u043B\u043B"
];
var tabColumns = [
  "\u041C\u0435\u0441\u0442\u043E",
  "\u041D\u0430\u0437\u0432\u0430\u043D\u0438\u0435 \u043A\u043E\u043C\u043F\u0430\u043D\u0438\u0438",
  "\u0420\u0435\u0433\u0438\u043E\u043D",
  "\u0427\u0438\u0441\u043B\u0435\u043D\u043D\u043E\u0441\u0442\u044C",
  "\u041E\u0442\u0440\u0430\u0441\u043B\u044C"
];
var collect = (data, keys) => {
  const c = {};
  keys.forEach((k) => c[k] = data[k]);
  return c;
};
var cleanupTable = (t, c, count) => {
  if (count)
    t = t.slice(0, count);
  return t.map((d, i) => collect(d, c));
};
var cleanupFile = async (f, c, count) => {
  const fname = await import_path.default.resolve(`${srcPath}/${f}.json`);
  console.log("reading", fname);
  const tableJson = await import_promises.default.readFile(fname, { encoding: "utf8" });
  const table = cleanupTable(JSON.parse(tableJson), c, 50);
  const tname = await import_path.default.resolve(`${destPath}/${f}.json`);
  console.log("writing", tname);
  await import_promises.default.writeFile(tname, JSON.stringify(table, null, " "));
};
(async () => {
  tableFiles.forEach((f) => cleanupFile(f, tableColumns, 50));
  tabFiles.forEach((f) => cleanupFile(f, tabColumns, 50));
})();
