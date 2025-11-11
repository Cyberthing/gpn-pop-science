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

const renderSlotContent = (s)=>{
    const { image, title, header, text } = s
    return <>
        { title ? <AText noGutter={false} style="leadTitle" text={title}/> : null }
        { header ? <AText noGutter={false} style="leadHeader" text={header}/> : null }
        { text ? <AText noGutter={false} style="leadText" text={text}/> : null }
        { image ? <Media className="leadVideo" media={{ url: image }}/> : null }
    </>
}

export const Ender = ({ left, right, backPlateImage, backPlateColor, backgroundImage, backgroundColor }) => {
    const scene = useScene()

    trace('Lead', left, right, backPlateImage, backPlateColor, backgroundImage, backgroundColor)

    const r = (
        <Slice 
            className={cx('enderPage', (backPlateImage||backPlateColor)&&'wBackPlate')}
            back={<>
                {backgroundColor?<Overlay cover backgroundColor={backgroundColor}/>:null}
                {backgroundImage?
                    <Overlay 
                        cover 
                        mode="background" 
                        src={backgroundImage}
                        backgroundPosition="right center"
                        backgroundSize="auto 100%"
                        />:null}
                
                {backPlateImage||backPlateColor ? 
                    <BackPlate 
                        media={backPlateImage?{ url: backPlateImage }:null} 
                        color={backPlateColor} /> 
                : null}
            </>}
        >
            <Slice.LeftSlot>
                { left&&renderSlotContent(left) }
            </Slice.LeftSlot>
            <Slice.RightSlot>
                { right&&renderSlotContent(right) }
            </Slice.RightSlot>
        </Slice>
    )
    return r
}

export default Ender
