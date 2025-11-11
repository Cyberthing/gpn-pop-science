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

export const Quiz = ({ title, question, correct, answers, ava }) => {
    const scene = useScene()

    const r = (
        <Slice 
            className={cx('slice_v2 footerPage')}
            column
            // align='center'
            valign="bottom"
            // minHeight={`${scene.height}px`}
            // minHeight={scene.mobile?"100vh":`720px`}			
        >
            {/* { scene.mobile ? <Media media={backgroundMobile}/> : null} */}
            <Row w100 className="coverTextCon">
                <Column 
                    width={scene.mobile?null:"8"} 
                >
                    <AText noGutter={false} style="coverLead" text={title}/>
                </Column>
                <Column 
                    left={scene.mobile?null:"3"} 
                    width={scene.mobile?null:"9"} 
                >
                    <Media className="coverVideo" media={{
                        url: ava
                    }}/>
                </Column>
            </Row>
        </Slice>
    )
    return r
}

export default Quiz
