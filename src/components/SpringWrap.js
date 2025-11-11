import React, { useRef, useEffect, useMemo, useCallback, useState } from 'react'
// import { useSpring, useSprings, animated } from 'react-spring';
import { animated, useSpring } from '@react-spring/web'
import { isArray } from '@ips/app/hidash'

export const SpringWrap = (C, config = { mass: 15, tension: 250, friction: 150 })=>{
  const AC = animated(C)

  return (({aniProps, aniReverse, ...p})=>{
    const [_aniProps, setAniProps] = useState(aniProps)
    const setFinalProps = ()=>setAniProps(aniProps[aniProps.length-1])
    useEffect(()=>{
      setAniProps(aniProps)
    },[aniProps])
    // console.log('aniReverse', aniReverse)
    const sprops = useSpring({
      // reset:aniProps != _aniProps,
      // cancel:aniProps != _aniProps,
      reverse: aniReverse,
      to: _aniProps,
      onRest: isArray(aniProps)?setFinalProps : null,
      config: config,
      // onChange: (e)=>{
      //   trace('update', e)
      // }
    })
    // console.log('sprops', sprops)
    return <AC {...sprops} {...p}/>
  })
}

export default SpringWrap