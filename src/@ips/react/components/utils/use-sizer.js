import { useState } from 'react';
import { useCallback, useMemo } from 'use-memo-one'
import createEventTargetHook from './create-event-target-hook';
import Sizer from '@ips/app/sizer';

const useSizerEvents = createEventTargetHook(Sizer.ee);
// let counter = 0


// trace('useSizer', Sizer)

export const useSizerSize = ()=>{
  const [val, setVal] = useState([Sizer.curSize, Sizer.curSizeName])
  const handler = useCallback(s => setVal(s), [])
  // const handler = useMemo(() => eval(`s=>{ trace(${counter++}); setVal(s) }` ),[])
  useSizerEvents('size', handler)
  return val
}

export const useSizerOrientation = ()=>{
  const [val, setVal] = useState([Sizer.curOrientation, Sizer.curOrientationName])
  const handler = useCallback(s => setVal(s), [])
  useSizerEvents('orientation', handler)
  return val
}
