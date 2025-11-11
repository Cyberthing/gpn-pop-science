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
import Lead from '@/components/Lead'

export const Underground = ({ title, question, correct, answers, ava, u1, u2,}) => {
    const scene = useScene()

    const r = (<>
        <Lead
            {...u1}
        />
        <Lead
            {...u2}
        />        
    </>)
    return r
}

export default Underground
