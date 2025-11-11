import fs from 'fs'
import path from 'path'
import process from 'process'

import '@ips/app/trace'

import initStrapi from '@ips/strapi/client'
import tmStrapiData from '../../../src/utils/tmStrapiData'
import { collectMedia } from '@ips/strapi/data'
import { mediaUrlToType } from '@ips/strapi/mediaMime'
import { downloadFile } from '@ips/strapi/download'

const assetpath = '../../assets';
const imgpath = '../../assets/img';
const videopath = '../../assets/media';
const datapath = '../../assets';
// const imgpath = '.';

// console.log('argv', process.argv)

const tmpPath = path.join(__dirname, 'tmp')

const setUp = ()=>{
  try{
    fs.mkdirSync(tmpPath)
  }catch(err){
    if (err && err.code != 'EEXIST') {
        return console.error(err);
    }
  }
}


(async()=>{

  setUp()

  const config = JSON.parse(fs.readFileSync(`${assetpath}/config.json`, 'utf-8'))
  // trace(config)

  let locales = process.argv.slice(2)
  if(!locales.length)
    locales.push(config.locale)

  const serverUrl = 'http:'+config.backURI;
  const strapi = initStrapi(serverUrl)

  if(locales[0] == 'all'){
    trace('getting locale list')
    locales = await strapi.getLocales()
    locales = locales.map(l=>l.code)
  }
  trace('locales', locales)
  
  const mediaMap = {}

  const q = fs.readFileSync('../../assets/data.gql', 'utf-8')
  // trace('main.gql', q)
  await Promise.all(locales.map(async locale=>{  
    // trace('getting locale', locale)
    let result = await strapi.getData(q, { locale })
    result = tmStrapiData(result)

    collectMedia(result, mediaMap)

    fs.writeFileSync(`${assetpath}/data-${locale}.json`, JSON.stringify(result, null, ' '))
  }))

  trace('media', Object.keys(mediaMap))

  const mediaProms = Object.values(mediaMap).map(v=>{
    try {
      return downloadFile(path.join(tmpPath, path.basename(v.url)), new URL(v.serverUrl, serverUrl).toString())
    } catch(err) {
      console.log(err)
    }
  })

  const files = await Promise.all(mediaProms)
  const cfiles = await Promise.all(files.map(f=>new Promise((resolve, reject)=>{
    const type = mediaUrlToType(f)
    const ppath = type == 'image' ? imgpath : type == 'video' ? videopath : type == 'data' ? datapath : assetpath
    const target = path.join(ppath, path.basename(f))
    fs.copyFile(f, target, (err) => {
      if (err) {
        console.error(err);
        reject()
      }
      else {     
        resolve(target)
      }
    });
  })))
  trace('done')

})()
