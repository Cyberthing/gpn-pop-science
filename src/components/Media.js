import React, { forwardRef } from 'react'
import { mediaMimeToType, mediaUrlToType } from '../utils/mediaMimeToType';
import { Pic } from '@ips/react/components/pic';
import { Vidos } from '@ips/react/components/vidos';

export const Media = forwardRef(({
  media = {},
  poster,
  className,
  overlay,
  contain,
  autoPlay,
  noGutter,
  h100,
  ...p
}, ref) => {
  const { mime = '', url = '' } = media;
  const mt = mime ? mediaMimeToType(mime) : mediaUrlToType(url);
  autoPlay = 'undefined' != typeof autoPlay ? autoPlay : true;

  className = `media ${className} ${overlay ? 'abs' : ''} ${
    contain ? 'contain' : ''
  }`;

  trace('media', url, mime, mt)

  return mt == 'image' ? (
    <Pic
      ref={ref}
      src={url}
      noGutter={noGutter??true}
      className={className}
      h100={h100}
      {...p}
    />
  ) : mt == 'video' ? (
    <Vidos
      ref={ref}
      muted
      loop
      poster={poster?.url}
      autoPlay={autoPlay}
      h100={h100}
      src={url}
      className={className}
      {...p}
    />
  ) : null;
});
Media.displayName = 'Media'

export default Media;
