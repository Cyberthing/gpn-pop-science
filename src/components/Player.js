import React,  { Fragment, forwardRef, createRef, useRef, useState, useEffect, useCallback, useMemo, memo, createContext, useContext } from 'react';
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
import FadeDrop from '@/components/FadeDrop';

import { useConfig } from '@/hooks/useConfig'
// import { useResize } from '@ips/react/components/utils/use-resize.js';
import createStaticEventTargetHook from '@/utils/eventTargetHook';

export const PlayerContext = createContext()
export const usePlayer = ()=>useContext(PlayerContext)

const useWindow = createStaticEventTargetHook(window);

const Visualizer = ({ medias, current=0, isPlaying })=>{

   	trace('Visualizer', medias, current)
	const b = medias[Math.max(0, Math.min(medias.length - 1, current))]

    return (
            <FadeDrop slide={
                <MediaBack 
                    autoPlay={isPlaying}
                    loop 
                    muted 
                    media={{ url: b }} 
                    className={cx(
                        // "backfader-back", 
                        b.style, 
                    )}/>
            } 
            id={current}
        />    
    )
}

const Button = ({icon, onClick, ...p})=>{

    const ref = useRef()
    const [pressed, setPressed] = useState(false)
    const { icons=[] } = useConfig()

    useWindow('pointerup', (event)=>{
        // trace('pointerup', event)
        if(!pressed)
            return
        setPressed(false)
        if(!ref.current.contains(event.target))
            return
        onClick?.()
    }, null, [pressed, onClick])

    // trace('icons', icons)
    
    return (<div 
        ref={ref}
        className={cx('playerBtn', pressed&&'pressed')} {...p}
        onPointerDown={()=>setPressed(true)}
    >
        <Pic src={icons.base} noGutter/>
        {/* <Pic src={icons.base} noGutter/> */}
        <Pic src={icons[icon]} noGutter/>
    </div>)
}

const Play = (p)=>(<Button icon={'play'} {...p}/>)
const Pause = (p)=>(<Button icon={'pause'} {...p}/>)
const Stop = (p)=>(<Button icon={'stop'} {...p}/>)
const Prev = (p)=>(<Button icon={'prev'} {...p}/>)
const Next = (p)=>(<Button icon={'next'} {...p}/>)
const Eject = (p)=>(<Button icon={'eject'} {...p}/>)
const Equalizer = ()=>(null)
const Volume = ()=>(null)
const Time = ()=>(null)
const Progress = ()=>(null)
const TrackList = ({ tracks, current })=>(null)
const CurrentTrack = ({ track })=>(null)


export const Player = ({ 
    image, 
    medias, 
    current, 
    navigatePrev,
    navigateTo,
    navigateNext,
    ...p })=>{
    // trace('Article', blocks)
    const [w, setW] = useState(0)
    const ref = useRef()

    const player = usePlayer()

    useWindow('resize', ()=>{
        // setW(ref.current.offsetWidth)
        // trace('useResize', ref.current.offsetWidth)
        ref.current.style.setProperty('--playerw', ""+ref.current.offsetWidth)
    },null, [])
    return (
        <Overlay cover ghost>
            <Sticky>
                <Slice>
                    <Slice.LeftSlot ref={ref}>
                        <Media media={{ url: image }}/>
                        <Overlay left="1.5%" width="97%" top="4.2%" height="51.5%">
                            <Visualizer
                                medias={medias}
                                current={Math.max(0, current)}
                                isPlaying={player.isPlaying}
                            />
                        </Overlay>
                        <Overlay ly="0.743" w100>
                            <Row align="space-between" padding="0 3.5%">
                                <Row className="btnCont">
                                    <Prev onClick={navigatePrev}/>
                                    <Play onClick={()=>player.continueOrPlay(current)}/>
                                    <Pause onClick={()=>player.pause()}/>
                                    <Stop onClick={()=>player.stop()}/>
                                    <Next onClick={navigateNext}/>
                                </Row>
                                <Eject  onClick={()=>navigateTo(-1)}/>
                            </Row>
                        </Overlay>
                    </Slice.LeftSlot>
                </Slice>
            </Sticky>
        </Overlay>
    )
}

export default Player