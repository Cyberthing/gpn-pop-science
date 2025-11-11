import fs from 'fs'
// import path from 'path'
// import '@ips/app/trace'
import initStrapi from '@ips/strapi/client'
// import rtl from './rtl'

const assetpath = '../../assets';

(async()=>{

  const config = JSON.parse(fs.readFileSync(`${assetpath}/config.json`, 'utf-8'))
  const serverUrl = 'http:'+config.backURI;
  const strapi = initStrapi(serverUrl)
  const locales = await strapi.getLocales()
  fs.writeFileSync(`${assetpath}/locales.json`, JSON.stringify(locales, null, ' '))

})()
