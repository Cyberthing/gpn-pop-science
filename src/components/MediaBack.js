import React, { forwardRef } from 'react'
import { mediaMimeToType, mediaUrlToType } from '../utils/mediaMimeToType';
import { Overlay } from '@ips/react/components/overlay';
import { Pic } from '@ips/react/components/pic';
import { Vidos } from '@ips/react/components/vidos';

export const MediaBack = forwardRef(({media, poster, autoPlay, ...p}, ref) => {
  media = media || {}
  const mt = mediaMimeToType(media.mime) || mediaUrlToType(media.url)
  // console.log('MediaBack mt', mt, media)
  autoPlay = ('undefined' != typeof autoPlay) ? autoPlay : true

  return mt=='image' ? <Overlay ref={ref} cover mode="background" img={media.url} {...p}/> :
          mt=='video' ? <Vidos ref={ref} mode="background" poster={poster?.url} muted loop autoPlay={autoPlay} src={media.url} {...p}/> : 
          null
})
MediaBack.displayName = 'MediaBack'

export default MediaBack