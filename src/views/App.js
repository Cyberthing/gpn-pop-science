import React,  { Fragment, forwardRef, createRef, useRef, useState, useEffect, useCallback, useMemo, memo, createContext, useContext } from 'react';
import scrollSnapPolyfill from 'css-scroll-snap-polyfill'
import cx from '@ips/app/classnamex'
import { times } from '@ips/app/hidash'

import { useScene } from '@ips/react/components/utils/use-scene'
import { useIntersectionObserver } from '@ips/react/components/utils/use-intersection-observer'
import { useRegistryEvent } from '@ips/react/components/utils/react-app-registry'

import Setup from '@/components/Setup'
// import Landing from '@/components/Landing'
import Overlay from '@ips/react/components/overlay'
import Sticky from '@ips/react/components/sticky'
import Emergent from '@ips/react/components/emergent'

import Pic from '@ips/react/components/pic'
import { AnalyticsAnchor } from '@ips/react/components/analytics-anchor';

//import Background from '@/components/Background'
import AText from '@/components/AText'
import { withConfig } from '@/hooks/useConfig';

import Way from '@ips/react/components/way'
import Waypoint from '@ips/react/components/waypoint'

// import Burger from '@/components/Burger'

import { getFullOffsetTop } from '@ips/app/dom-utils'
import { Column, Row } from '@ips/react/components/layout';
import Slice from '@/components/Slice';
import prepareData from '../utils/prepareData'
import Media from '@/components/Media';
import MediaBack from '@/components/MediaBack';
import { useConfig } from '@/hooks/useConfig'
import { useScrollTracker } from '@/hooks/useScrollTracker'

import {createPlayer} from '@/utils/player'

import BackgroundFader from '@/components/BackgroundFader';
import Cover from '@/components/Cover';
import Article from '@/components/Article';
import {Player, PlayerContext, usePlayer} from '@/components/Player';
import debounce from 'lodash/debounce'

// import content from '@/content'

// import Test from '@/test/App'

import * as analytics from '@/analytics'

 const instantScrollTo = (ofs)=>{
   document.documentElement.scrollTop = ofs
 }

 const smoothScrollTo = ($el)=>{
    $el.scrollIntoView({ behavior: 'smooth' })
 }

let renderCounter = 0

export function App({ project, data }) {
  const scene = useScene()
  const [sw, setSw] = useState(1)

  const player = usePlayer()

  const debouncePlay = useMemo(()=>debounce((i)=>{
    trace('playing', i)
    if(i < 0 || i > articles.length-1)
      player.stop()
    else
      player.play(i)
  },500),[player])

  const [curBack, _setCurBack] = useState(-1)
  const [curProgress, setCurProgress] = useState(0)
  const setCurBack = (cback)=>{
    _setCurBack(cback)
    debouncePlay(cback)
  }
  useRegistryEvent('backs', 'point', (point)=>{
    // trace('point', point)

    setCurProgress(point.continous-(point.continous|0))

    if(curBack != point.index)
      setCurBack(point.index)
  },[curBack])

  useEffect(()=>{
    const nsw = Math.min(720, scene.width)
    if(nsw != sw)
      setSw(nsw)
  },[scene.width])

  // useEffect(()=>{
  //   trace('playing curba', curBack)
  //   if(curBack < 0 || curBack > articles.length-1)
  //     player.stop()
  //   else
  //     player.play(curBack)
  // },[curBack])

  const refRoot = useRef()

  const { main = {} } = useMemo(()=>prepareData(data), [data])
  const { articles = [], cover, footer } = data?.main

  const [navRefs] = useState(()=>articles.map(createRef))

  const tracks = useMemo(()=>(articles.map((a, i)=>({
    title: a.audioTitle,
    duration: a.audioLength,
  }))),[articles])
  //const setRef = (i, el)=>navRefs[i].current = el
  trace('App data', data, navRefs)

  const navigateTo = useCallback((i, index)=>{
      setTimeout(()=>{
        trace('navigateTo', i, index)
        analytics.innerLink?.(i)

        if(i == -1)
          smoothScrollTo(refRoot.current)

        if(!navRefs[i].current)
          return

        const el = !index ? navRefs[i].current : navRefs[i].current.querySelector(`[data-index="${index}"]`)
        if(!el)
          return

        smoothScrollTo(el)
        
        // const ofs = getFullOffsetTop(el)
        // instantScrollTo(ofs + (scene.mobile?(-100):(scene.height/2)))
      },100)
  },[scene.height, scene.mobile])

  const navigatePrev = ()=>{
    navigateTo(Math.max(0, curBack-1))
  }
  const navigateNext = ()=>{
    navigateTo(Math.min(4, curBack+1))
  }

  // const scrollPos = useScrollTracker(refRoot)
  //trace('scrollPos', scrollPos)


  // main.config.setLightboxData = setLightboxData

  return withConfig(
    main.config,

    (<div className={cx(project)} ref={refRoot}
      style={{
        '--sw': sw/100,
        '--sx': scene.width,
        '--sy': scene.height,
        '--cheight': refRoot.current?.offsetHeight,
        // '--scrolly': scrollPos,
      }}
    >
    <Way name="backs" continous throttle={100}/>
    <Way name="nav"/>
    <AnalyticsAnchor id="anchor-01"/>
    <Setup/>

    <BackgroundFader
      backs={main.backs} 
      current={Math.max(0, curBack)||0} 
      fade={Math.max(0, curBack)%2}
    />
    <Cover {...main.cover}/>
    <Column w100>
      { articles.map((a, i)=><Article key={i} ref={navRefs[i]} {...a}/>) }
      <Waypoint way="backs" edge="0vh"/>
      <Player 
        {...main.player} 
        tracks={tracks}
        isPlaying={player.isPlaying}
        current={curBack}
        progress={curProgress}
        navigatePrev={navigatePrev}
        navigateTo={navigateTo}
        navigateNext={navigateNext}
      />
    </Column>
  </div>))
}

export default (p)=>{
  // trace('p', p)
  const [_player] = useState(()=>createPlayer(p.data.main.articles.map(a=>a.audio)))
  const [isPlaying, setIsPlaying] = useState()
  const playerCtx ={
    play(i){
      _player.play(i)
      setIsPlaying(true)
    },
    continueOrPlay: (i)=>{
      _player.continueOrPlay(i)
      setIsPlaying(true)
    },
    pause(){
      _player.pause()
      setIsPlaying(false)
    },
    stop(){
      _player.stop()
      setIsPlaying(false)
    },
    isPlaying,
  }

  return <PlayerContext.Provider value={playerCtx}>
    <App {...p}/>
  </PlayerContext.Provider>
}
