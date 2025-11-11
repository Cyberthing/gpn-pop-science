import ipsGlobal from './ips-global.js'
import app from './app.js'
import { ud, isString } from './hidash.js'

const nop = ()=>{}

// const isAbsoluteUrl = url=>{
//   var regExp = new RegExp("//" + location.host + "($|/)");
//   var isLocal = (url.substring(0,4) === "http" || url.substring(0,5) === "https") ? regExp.test(url) : true;
//   return !isLocal
// }

const isAbsoluteURL = url=>{
  var r = new RegExp('^(?:[a-z+]+:)?//', 'i');
  return r.test(url)
}


export function localizeUrl(url, opts){
    if(ud(url)) return ''
    if(isString(opts))
        opts = { path:opts, usePrefixDir:false }

    if(isAbsoluteURL(url)) return url

    // trace('localizeUrl', url, opts)

    const ss = url.split('/')
    const d = ss[ss.length-2]
    const fname = ss[ss.length-1].replace(/\s/g, "%20")

    const mpath = app.mediaPath||app.publicPath
    return `${ mpath ? (mpath + '/') : '' }${ opts.path ? (opts.path + '/'): '' }${ (opts.usePrefixDir && d) ? (d + '_'): '' }${ fname }`
}

app.scriptRegistry = app.scriptRegistry||{}
ipsGlobal.scriptRegistry = ipsGlobal.scriptRegistry||{}

export const loadScriptCb = (url, cb, opts={})=>{
    const scriptRegistry = opts.global ? ipsGlobal.scriptRegistry : app.scriptRegistry
    if(scriptRegistry[url] && !opts.allowMultiple){
        cb()
        return
    }

    const el = document.createElement('script')
    document.head.appendChild(el)
    el.setAttribute('type', 'text/javascript')
    el.src = url
    el.addEventListener('load', ()=>{
        scriptRegistry[url] = true
        cb()
    })
    el.addEventListener('error', cb)
}

export const loadScriptsCb = loadScriptCb

export const loadScript = (url, opts={})=>new Promise((resolve, reject)=>loadScriptCb(url, e=>e?reject(e):resolve(), opts))

// export function loadScript(url, opts={}){
//     const scriptRegistry = opts.global ? ipsGlobal.scriptRegistry : app.scriptRegistry
//     if(scriptRegistry[url] && !opts.allowMultiple)
//         return Promise.resolve()

//     return new Promise((resolve, reject)=>{
//         const el = document.createElement('script')
//         document.head.appendChild(el)
//         el.setAttribute('type', 'text/javascript')
//         el.src = url
//         el.addEventListener('load', ()=>{
//             scriptRegistry[url] = true
//             resolve()
//         })
//         el.addEventListener('error', reject)
//     })
// }

export function loadStyleLinkCb(url, cb, opts){
    cb = cb || nop;
    opts = opts||{};
    var scriptRegistry = ipsGlobal.scriptRegistry;
    if(scriptRegistry[url]){
        cb();
        return;
    }

    const el = document.createElement('link');
    document.head.appendChild(el);
    el.setAttribute('rel', 'stylesheet');
    el.addEventListener('load', function(){
        scriptRegistry[url] = true;
        cb();
    });
    el.addEventListener('error', cb);
    el.href = url;
}

export const loadStyleLink = (url, opts)=> new Promise((resolve, reject)=>loadStyleLinkCb(url, e=>e?reject(e):resolve(), opts))