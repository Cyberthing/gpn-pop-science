import React from 'react';
import Media from '@/components/Media'
import cx from '@ips/app/classnamex'

const tm = (s, r)=>(!s && !r) ? null : `scale(${(s||100)*0.01}) rotate(${r||0}deg)`

export const Shape = ({ media, className, x, y, s, r, ...p })=><Media className={cx("sprite", className)} noGutter media={media}
  style={{ left: `${x||0}%`, top: `${y||0}%`, transform: tm(s, r) }}
/>

export default Shape
