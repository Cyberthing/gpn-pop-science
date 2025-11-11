import React,  { Fragment, forwardRef, createRef, useRef, useState, useEffect, useCallback, useMemo, memo } from 'react';
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

//import Board from '@/components/Board'
import Cover from '@/components/Cover'
import Lead from '@/components/Lead'
// import Lead from '@/components/Lead'
import Quiz from '@/components/Quiz'
import Earth from '@/components/Earth'
import Map from '@/components/Map'
import Factos from '@/components/Factos'
import Cards from '@/components/Cards'
import Underground from '@/components/Underground'
import IceFactos from '@/components/IceFactos'
import Ender from '@/components/Ender'
import Footer from '@/components/Footer'
//import StickyFrame from '@/components/StickyFrame'
//import ModalOverlay from '@/components/ModalOverlay'

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
import { HeroMobile } from '@/components/Test';
import BackgroundFader from '@/components/BackgroundFader';
import NavBar from '@/components/NavBar';
import FadeDrop from '@/components/FadeDrop';
import PhotoLightbox from '@/components/PhotoLightbox'

import content from '@/content'

// import Test from '@/test/App'

import * as analytics from '@/analytics'

 const instantScrollTo = (ofs)=>{
   document.documentElement.scrollTop = ofs
 }

let renderCounter = 0

export function App({ project, data }) {
  const scene = useScene()
  const [sw, setSw] = useState(1)

  const [curBack, setCurBack] = useState(0)
  useRegistryEvent('backs', 'point', point=>setCurBack(Math.max(0, point.index)))

  useEffect(()=>{
    const nsw = Math.min(720, scene.width)
    if(nsw != sw)
      setSw(nsw)
  },[scene.width])

  const refRoot = useRef()

  const { main = {} } = data
  const { articles = [], cover, footer } = data?.main

  const [navRefs] = useState(()=>articles.map(createRef))
  //const setRef = (i, el)=>navRefs[i].current = el
  trace('App data', data, navRefs)

  const navigateTo = useCallback((i, index)=>{
      setTimeout(()=>{
        trace('navigateTo', i, index)
        analytics.innerLink?.(i)

        if(!navRefs[i].current)
          return

        const el = !index ? navRefs[i].current : navRefs[i].current.querySelector(`[data-index="${index}"]`)
        if(!el)
          return
        
        const ofs = getFullOffsetTop(el)
        instantScrollTo(ofs + (scene.mobile?(-100):(scene.height/2)))
      },100)
  },[scene.height, scene.mobile])

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
    <Way name="backs"/>
    <Way name="nav"/>
    <Way name="factos"/>
    <AnalyticsAnchor id="anchor-01"/>
    <Setup/>
    {/* <BackgroundFader backs={main.backs} current={(curBack/2)|0} fade={curBack%2}/> */}
    <Cover {...main.cover}/>
    <Lead {...main.lead1}/>
    <Quiz {...main.quiz1}/>

    <Earth {...main.earth}/>
    <Quiz {...main.quiz2}/>
    <Map {...main.map}/>
    <Factos {...main.factos}/>
    <Quiz {...main.quiz3}/>
    <Lead {...main.lead2}/>
    <Cards {...main.cards}/>
    { main.lead3.map((l, i)=><Lead key={i} {...l}/>) }     
    <Underground {...main.underground}/>
    <IceFactos {...main.iceFactos}/>
    <Ender {...main.ender}/>
    <Footer {...main.footer}/>
  </div>))
}

export default App;
