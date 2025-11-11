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

export const Quiz = ({ image, legend }) => {
    // const scene = useScene()

    const r = (
        <Slice 
            className={cx('mapPage')}
            column
            valign="bottom"
        >
            <Row w100 className="mapCon">
                <Media className="mapImage" media={{
                    url: image
                }}/>
                <Overlay 
                    mode="img"
                    src={legend}
                    ly="1"
                />
            </Row>
        </Slice>
    )
    return r
}

export default Quiz
