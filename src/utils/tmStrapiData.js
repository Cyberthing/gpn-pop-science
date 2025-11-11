import { tmData, tmMedia, collectMedia } from '@ips/strapi/data';

export const tmStrapiData = (data)=>{
  // trace('tmStrapiData', data)
  data = tmData(data)
  data = tmMedia(data, {
    // parseMediaFields:o=>{
    //   if(o.__typename == 'ComponentElementsBodyText')
    //     return ['text']
    // }
  })

  // data.main?.slides?.forEach((s)=>{
  //   if(s.__typename == 'Facto'){
  //     s.title = s.title || 'Факт'
  //   }
  // })

  return data;
}

export default tmStrapiData