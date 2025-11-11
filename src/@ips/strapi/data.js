import { ud, isObject, isArray } from '@ips/app/hidash'
import { mediaUrlToMime } from './mediaMime'

const undatt = d=>d?.data?.attributes
const undarr = d=>d?.data.map(dd=>dd.attributes)
const unref = d=>undatt(d.ref)
const isref= d=>d.__typename&&d.__typename.startsWith('ComponentRefs')
const isdatt= d=>!!d?.data?.attributes
const isdarr= d=>isArray(d?.data)


const reImg = /<img\s+[^>]*>/g
const reImgSrc = /<img\s+[^>]*src="([\w\.\/]+)"[^>]*/g
const reParams = /([\w-]+)\s*="([\w\-\.\/\s]*)"/g

const getAllMatches = (s, rre)=>{
  const re = new RegExp(rre)
  const r = []
  let m
  while (m = re.exec(s)) {
    r.push(m)
  }
  return r
}

const parseImgs = s=>{
  const imgs = getAllMatches(s, reImg).map(v=>v[0])
  return imgs.map(i=>{
    const p = getAllMatches(i, reParams).map(v=>[v[1],v[2]])
    return p
  })
}

export const getImgSrc = (s)=>{
  const re = new RegExp(reImgSrc)
  const r = []
  let m
  while (m = re.exec(s)) {
    r.push(m[1])
  }
  return r
}

const createImgMedia = params=>{
  const src = params.find(p=>p[0] == 'src')?.[1]

  return ({
    __typename: 'UploadFile',
    url: src,
    basename: src.split('.')[0],
    width: params.find(p=>p[0] == 'width')?.[1],
    height: params.find(p=>p[0] == 'height')?.[1],
    mime: mediaUrlToMime(src),
  })
}


const travFix = d=>{
  // trace('trav', d)
  if(ud(d) || null == d)
    return d
  if(isref(d)){
    d = unref(d)
  }
  if(isArray(d))
    return travArr(d)
  if(isObject(d))
    return travObj(d)
  return d
}

const travArr = d=> d.map(travFix)

const travObj = d=>{
  const o = {}
  Object.keys(d).forEach(k=>{
    if(isdatt(d[k]))
      o[k] = undatt(d[k])
    else if(isdarr(d[k]))
      o[k] = undarr(d[k])
    // else if(isref(d[k]))
    //  return unref(d[k])
    else o[k] = d[k]
  })

  const oo = {}
  Object.keys(o).forEach(k=>{
    oo[k] = travFix(o[k])
  })

  return oo
}

export const trav = (d, pred)=>{
  if(pred(d))
    return

  const trapred = d=>trav(d, pred)

  if(isArray(d))
    d.forEach(trapred)

  if(isObject(d)){
    Object.values(d).forEach(trapred)
  }

}

export const tmData = (data)=>{
  return travObj(data)
}

export const tmMedia = (data, opts = {})=>{
  const { parseMediaFields } = opts

  trav(data, o=>{
    if(!o)
      return
    if(o.__typename == 'UploadFile'){
      if(!o.serverUrl){
        o.serverUrl = o.url
        const surl = o.url.split('/')
        o.url = surl.pop()
        o.basename = o.url.split('.')[0]
      }
      return true
    }

    const mfields = parseMediaFields&&parseMediaFields(o)
    if(mfields&&mfields.length){
      if(!o.mediaMap){
        o.mediaMap = {}
        mfields.forEach(mfield=>{
          const simgs = getAllMatches(o[mfield], reImg).map(v=>v[0])
          if(simgs.length){
            simgs.forEach(simg=>{
              const params = getAllMatches(simg, reParams).map(v=>[v[1], v[2]])
              // trace('params',params)
              const media = createImgMedia(params)
              media.serverUrl = media.url
              media.url = media.url.split('/').pop() 
              o.mediaMap[media.url] = media
              o[mfield] = o[mfield].replace(media.serverUrl, media.url)

              const srcset = params.find(p=>p[0] == 'srcset')?.[1]
              if(srcset)
                o[mfield] = o[mfield].replace(srcset, "")
            })
          }
        })
      }
    }

  })

  return data 
}

export const collectMedia = (data, mediaMap={})=>{
  trav(data, (o) => {
    if (!o) return;
    if (o.__typename == 'UploadFile') {
      mediaMap[o.url] = o;
      return true;
    }

    return false;
  });
  return mediaMap
}