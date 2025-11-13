import React, { memo } from 'react';
import Text from '@ips/react/components/text'
import cx from '@ips/app/classnamex'

export const AText = memo(({ text, style, noGutter, className, ...p })=>(
    <Text 
        yo 
        noGutter={noGutter} 
        className={cx('atext', className, style)} 
        textStyle={style} 
        text={text} 
        {...p}
    />))

export default AText