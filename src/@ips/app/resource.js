import { localizeUrl } from './utils.js'

let localize = true

export function setLocalize(is){
    localize = is
}

const urlDirs = {
    'image':'img',
    'video':'media'
}

export function setUrlDir(url, type){
    urlDirs[type] = url
}

export function requestUrl(url, type, opts){
    // trace('requestUrl', url, type)

    // const a = [ ...opts ] // this works
    // const a = { ...opts } // this doesnt
    if(!localize)
        return url

    const dir = urlDirs[type]||''
    return localizeUrl(url, Object.assign({}, { path: dir, usePrefixDir:true }, opts))

    // switch(type){
    //     case 'image':{
    //         return localizeUrl(url, Object.assign({}, { path: 'img', usePrefixDir:true }, opts))
    //     }
    //     case 'video':{
    //         return localizeUrl(url, Object.assign({}, { path: 'media', usePrefixDir:false }, opts))
    //     }
    //     case 'json':{
    //         return localizeUrl(url, Object.assign({}, { path: '', usePrefixDir:false }, opts))
    //     }
    //     case 'lottie':{
    //         return localizeUrl(url, Object.assign({}, { path: '', usePrefixDir:false }, opts))
    //     }
    //     default:
    //         return localizeUrl(url, Object.assign({}, { path: '', usePrefixDir:false }, opts))
    // }
}
