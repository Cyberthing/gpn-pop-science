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
const Progress = ({ progress })=>{
    const { icons=[] } = useConfig()
   
    return (
        <div className='progress' style={{ '--progress': `${progress*100}%` }}>
            <div>
                <div className='progressPin'>
                    <Pic src={icons.progress} noGutter/>
                </div>
            </div>
        </div>
    )
}

const Track = ({ index='', current, title='', duration='', onSelect, className })=>(
    <div 
        className={cx('trackCont', className, current&&'current')}
        onClick={onSelect}
    >
        <AText noParagraph noGutter style="track" className="trackTitle" text={`${index > 0 ? `${index}.` : ''} ${title}`}/>
        <AText noParagraph noGutter style="track" text={duration}/>
    </div>
)

const CurrentTrack = (p)=>(<Track {...p} className="curtrack" current={false}/>)

const Visualizer = ({ background, medias, current=0, isPlaying })=>{

	const b = medias[Math.max(0, Math.min(medias.length - 1, current))]

    return (<Column>
            <Media media={{ url: background }}/>
            <Overlay left="1.5%" width="97%" top="7.2%" height="90.5%">
                <FadeDrop slide={
                    <MediaBack 
                        autoPlay={isPlaying}
                        loop 
                        muted 
                        media={{ url: b }} 
                        className={cx(
                            "visualizer", 
                            b.style, 
                        )}/>
                } 
                id={current}
            />    
            </Overlay>
        </Column>
    )
}

const Controls = forwardRef(({
    background,
    navigatePrev,
    navigateNext,
    navigateTo,
    progress,
    current,
    tracks,
    player,
}, ref)=>(
    <Column ref={ref}>
        <Media media={{ url: background }}/>
        <Overlay ly="0.80" w100>
            <Row align="space-between" padding="0 3.5%">
                <Row className="btnCont">
                    <Prev onClick={navigatePrev}/>
                    <Play onClick={()=>player.resumeOrPlay(current)}/>
                    <Pause onClick={()=>player.pause()}/>
                    <Stop onClick={()=>player.stop()}/>
                    <Next onClick={navigateNext}/>
                </Row>
                <Eject  onClick={()=>navigateTo(-1)}/>
            </Row>
        </Overlay>
        <Overlay ly="0.31" w100>
            <CurrentTrack title={tracks[current]?.title} index={-1}/>
        </Overlay>
        <Overlay ly="0.56" w100>
            <Progress progress={progress}/>
        </Overlay> 
    </Column>
))

const TrackList = ({ background, tracks = [], current, navigateTo })=>(
    <Column>
        <Media media={{ url: background }}/>
        <Overlay ly="0.6" w100>
            <div className='tracklist'>
                { tracks.map((t, i)=><Track 
                    key={i} 
                    current={i==current} 
                    index={i+1} 
                    onSelect={()=>navigateTo(i)}
                    {...t}
                />) }
            </div>
        </Overlay>    
    </Column>
)

export const Player = ({ 
    imageVisualizer,
    imageContols,
    imageTracklist,
    medias, 
    tracks,
    current, 
    progress,
    isPlaying,
    navigatePrev,
    navigateTo,
    navigateNext,
    ...p })=>{
    // trace('Article', blocks)
    const [w, setW] = useState(0)
    const refWidth = useRef()
    const refPlayer = useRef()
    const scene = useScene()

    const player = usePlayer()

    useEffect(()=>{
        refPlayer.current.style.setProperty('--playerw', ""+refWidth.current.offsetWidth)
    },[])

    useWindow('resize', ()=>{
        // setW(ref.current.offsetWidth)
        // trace('useResize', ref.current.offsetWidth)
        refPlayer.current.style.setProperty('--playerw', ""+refWidth.current.offsetWidth)
    },null, [])
    
    return (
        <Overlay height="calc(100% - 64px)" ghost>
            <Sticky>
                <Slice className={cx('player', isPlaying&&'playing')}>
                    <Slice.LeftSlot ref={refPlayer}className="playerCont" 
                        width={!scene.desktop?'100%':'4'}>
                        <div>
                            { scene.desktop ? <Visualizer
                                background={imageVisualizer}
                                medias={medias}
                                current={Math.max(0, current)}
                                isPlaying={player.isPlaying}
                            /> : null }
                            <Controls
                                ref={refWidth}
                                background={imageContols}
                                navigatePrev={navigatePrev}
                                navigateNext={navigateNext}
                                navigateTo={navigateTo}
                                progress={progress}
                                current={current}
                                tracks={tracks}
                                player={player}
                            />
                            { !scene.mobile ? <TrackList 
                                background={imageTracklist}
                                tracks={tracks} 
                                current={current}
                                navigateTo={navigateTo}
                            /> : null }
                        </div>
                    </Slice.LeftSlot>
                </Slice>
            </Sticky>
        </Overlay>
    )
}

export default Player