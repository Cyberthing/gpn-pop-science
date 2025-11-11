import { useState, useLayoutEffect } from 'react'
import { useMemo } from 'use-memo-one'

const eth = Target => (evt, cb, selector) => {

  useLayoutEffect(()=>{
    // trace('noorch', evt, Target, selector)
    if(!Target || !evt || !cb)
      return
    const T = selector?T.querySelector(selector):Target
    if(!T)
      return
    // trace('gotenda', T)
    T.addEventListener(evt, cb)
    return () => {
      // trace('denoorch', evt)
      T.removeEventListener(evt, cb)
    }
  }
  , [Target, evt, cb, selector])
      
  // only cleanup when call `off` or component unmount
  return [Target]
}

export const createStaticEventTargetHook = Target => {
  return eth(Target)
}

export const createEventTargetHook = Target => {
  // const [target, setTarget] = useState(Target)
  // if (typeof Target.addEventListener !== 'function') {
  //   // Runtime check instanceof EventTarget & still checkable in test code
  //   throw new Error('Not an event target')
  // }

  return useMemo(()=>eth(Target),[Target])
}

// export default createEventTargetHook
export default createStaticEventTargetHook