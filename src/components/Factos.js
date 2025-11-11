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
// import MediaBack from '@/components/MediaBack'

const FactoTitle = ({title})=><div className="facto">
    <AText noGutter style="leadTitle" text={title}/>
</div>

const Facto = ({image, title, text})=><div className="facto">
    { image ? <Media media={{url: image}}/> : null }
    <AText noGutter style="leadHeader" text={title}/>
    <AText noGutter style="leadText" text={text}/>
</div>

export const Factos = ({ title, factos }) => {
    // const scene = useScene()

    const r = (
        <Slice 
            className={cx('slice_v2 factosPage')}
            column
            // align='center'
            valign="bottom"
            // minHeight={`${scene.height}px`}
            // minHeight={scene.mobile?"100vh":`720px`}			
        >
            {/* { scene.mobile ? <Media media={backgroundMobile}/> : null} */}
            <Row w100 wrap className="factosCon">
                <FactoTitle title={title}/>
                {/* <AText noGutter={false} style="coverLead" text={title}/> */}
                {factos.map((f, i)=><Facto key={i} {...f}/>)}
            </Row>
        </Slice>
    )
    return r
}

export default Factos
