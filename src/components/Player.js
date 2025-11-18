import React,  { Fragment, forwardRef, createRef, useRef, useState, useEffect, useCallback, useMemo, memo } from 'react';
import cx from '@ips/app/classnamex'
// import { times } from '@ips/app/hidash'

import { useScene } from '@ips/react/components/utils/use-scene'
// import { useIntersectionObserver } from '@ips/react/components/utils/use-intersection-observer'
// import { useRegistryEvent } from '@ips/react/components/utils/react-app-registry'

import Overlay from '@ips/react/components/overlay'
// import Sticky from '@ips/react/components/sticky'
import Emergent from '@ips/react/components/emergent'

import Pic from '@ips/react/components/pic'
import { AnalyticsAnchor } from '@ips/react/components/analytics-anchor';

import AText from '@/components/AText'

// import Way from '@ips/react/components/way'
import Waypoint from '@ips/react/components/waypoint'

// import Burger from '@/components/Burger'

import { getFullOffsetTop } from '@ips/app/dom-utils'
import { Column, Row } from '@ips/react/components/layout';
import Slice from '@/components/Slice';
import Media from '@/components/Media';
import MediaBack from '@/components/MediaBack';
// import { useScrollTracker } from '@/hooks/useScrollTracker'
import Sticky from '@ips/react/components/sticky'

import { useConfig } from '@/hooks/useConfig'

const Button = ({icon, ...p})=>{

    const [pressed, setPressed] = useState(false)
    const { icons=[] } = useConfig()

    // trace('icons', icons)
    
    return (<div 
        className={cx('playerBtn', pressed&&'pressed')} {...p}
        onPointerDown={()=>setPressed(true)}
        onPointerUp={()=>setPressed(false)}
        >
        <Pic src={icons.base} noGutter/>
        {/* <Pic src={icons.base} noGutter/> */}
        <Pic src={icons[icon]} noGutter/>
    </div>)
}

const Play = ()=>(<Button icon={'play'} style={{ left: '10%', top: '10%' }}/>)
const Pause = ()=>(<Button icon={'pause'} style={{ left: '10%', top: '20%' }}/>)
const Stop = ()=>(<Button icon={'stop'} style={{ left: '10%', top: '30%' }}/>)
const Prev = ()=>(<Button icon={'prev'} style={{ left: '10%', top: '40%' }}/>)
const Next = ()=>(<Button icon={'next'} style={{ left: '10%', top: '50%' }}/>)
const Equalizer = ()=>(null)
const Volume = ()=>(null)
const Time = ()=>(null)
const Progress = ()=>(null)
const TrackList = ({ tracks, current })=>(null)
const CurrentTrack = ({ track })=>(null)

export const Player = ({ image, ...p })=>{
    // trace('Article', blocks)
    return (
        <Overlay cover ghost>
            <Sticky>
                <Slice>
                    <Slice.LeftSlot>
                        <Media media={{ url: image }}/>
                        <Play/>
                        <Pause/>
                        <Stop/>
                        <Prev/>
                        <Next/>
                    </Slice.LeftSlot>
                </Slice>
            </Sticky>
        </Overlay>
    )
}

export default Player