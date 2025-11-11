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
// import Lead from '@/components/Lead'

const IceFacto = ({ facto, desc })=><Column>
    <AText style="iceFacto" text={facto}/>
    <AText style="iceText" text={desc}/>
</Column>

// export const IceFactos = ({ left, right, ...p }) => {
export const IceFactos = ({ 
    backPlateImage, 
    backPlateColor, 
    backgroundImage, 
    backgroundColor,
    title, 
    header,
    facto1,
    facto2,
    text,
    facto3,
    facto4,
}) => {
    const scene = useScene()

    const r = <>
        { title ? <Column><AText noGutter style="leadTitle" text={title}/></Column> : null }
        <Row>
            <Slice.LeftSlot>
                <AText style="iceText" text={header}/>
                <Row>
                    <IceFacto {...facto1}/>
                    <IceFacto {...facto2}/>
                </Row>
                <AText style="iceText" text={text}/>
            </Slice.LeftSlot>
            <Slice.RightSlot/>
        </Row>
        <Row>
            <Slice.LeftSlot>
                <IceFacto {...facto3}/>
            </Slice.LeftSlot>
            <Slice.RightSlot
                valign="bottom"
            >
                    <IceFacto {...facto4}/>
            </Slice.RightSlot>            
        </Row>
    </>

    return (<Slice 
        className={cx('leadPage', 'iceFactosPage', (backPlateImage||backPlateColor)&&'wBackPlate')}
        // minHeight={minHeight}
        // height={height}
        column
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
    )
}

export default IceFactos
