import React,  { Fragment, createRef, useRef, useState, useEffect, useCallback, useMemo, memo } from 'react';
import { useScene } from '@ips/react/components/utils/use-scene';
import cx from '@ips/app/classnamex'
import { Column, Row } from '@ips/react/components/layout';
import { Slice } from '@/components/Slice';
import Overlay from '@ips/react/components/overlay'
import Sticky from '@ips/react/components/sticky'
import AText from './AText'
// import { colors } from '@/vars'
import Media from '@/components/Media'
import BackPlate from './BackPlate';
// import MediaBack from '@/components/MediaBack'
import { isFunction} from '@ips/app/hidash'
const renderSlotContent = (s)=>{
    const { image, title, header, text, blocks } = s
    return <>
        { title ? <AText noGutter={false} style="leadTitle" text={title}/> : null }
        { header ? <AText noGutter={false} style="leadHeader" text={header}/> : null }
        { text ? <AText noGutter={false} style="leadText" text={text}/> : null }
        { image ? <Media className="leadVideo" media={{ url: image }}/> : null }
        { blocks?.map((b, i)=>renderSlotContent(b)) }
    </>
}



export const Lead = ({ 
    className,
    textColor,
    left, 
    right, 
    backPlateImage, 
    backPlateColor, 
    backgroundImage,
    backgroundPosition, 
    backgroundSize,
    backgroundColor,
    minHeight,
    height
 }) => {
    const scene = useScene()

    trace('Lead', left, right, backPlateImage, backPlateColor, backgroundImage, backgroundColor)

    const r = (<>
        <Slice.LeftSlot>
            { left ? isFunction(left) ? left() : renderSlotContent(left) : null }
        </Slice.LeftSlot>
        <Slice.RightSlot>
            { right ? isFunction(right) ? right() : renderSlotContent(right) : null }
        </Slice.RightSlot>
    </>)

    return  <Slice 
        className={cx('leadPage', className, (backPlateImage||backPlateColor)&&'wBackPlate')}
        style={{
            '--textColor': textColor,
        }}
        minHeight={minHeight}
        height={height}
        back={<>
            {backgroundColor?<Overlay cover backgroundColor={backgroundColor}/>:null}
            {backgroundImage?
                <Overlay 
                    cover 
                    mode="background" 
                    src={backgroundImage}
                    backgroundPosition={backgroundPosition}
                    backgroundSize={backgroundSize}
                    />:null}
        </>}
    >
        {(backPlateImage||backPlateColor) ?
            <div className="backPlatedCon">
                <BackPlate 
                    media={backPlateImage?{ url: backPlateImage }:null}
                    color={backPlateColor} /> 
                {r}
            </div>
        : r }
    </Slice>
}

export default Lead
