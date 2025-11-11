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
import StickyFrame from '@/components/StickyFrame'
import Way from '@ips/react/components/way'
import Waypoint from '@ips/react/components/waypoint'
import { useRegistryEvent } from '@ips/react/components/utils/react-app-registry'

const StageContent = ({ title, header, text })=><Column className="earthContent">
    <Waypoint way="backs"/>
    <AText noGutter={false} style="leadTitle" text={title}/>
    <AText noGutter={false} style="leadHeader" text={header}/>
    <AText noGutter={false} style="leadText" text={text}/>
</Column>

export const Earth = ({ stages }) => {
    const scene = useScene()

    const [curStage, setCurStage] = useState(0)
    useRegistryEvent('backs', 'point', point=>setCurStage(Math.max(0, point.index)))

    const r = (
        <Slice 
            className={cx('slice_v2 earthPage')}
            column
            // align='center'
            valign="bottom"
            // minHeight={`${scene.height}px`}
            // minHeight={scene.mobile?"100vh":`720px`}			
        >
            <Way name="backs"/>
            {/* { scene.mobile ? <Media media={backgroundMobile}/> : null} */}
            <Row w100 className="coverTextCon">
                <Column 
                    width={scene.mobile?null:"8"} 
                >
                    { stages.map((s, i)=><StageContent key={i} {...s}/>)}
                </Column>
                <Column 
                    width={scene.mobile?null:"9"} 
                >
                    <StickyFrame>
                        {stages.map((s, i)=>
                            <Overlay
                                key={i}
                            >
                                <Media 
                                    className={cx("earthVideo" , i == curStage && 'visible')}
                                    media={{ url: s.media }}
                                    autoPlay
                                    loop
                                    muted
                                />
                            </Overlay>
                        )}
                    </StickyFrame>
                </Column>
            </Row>
        </Slice>
    )
    return r
}

export default Earth
