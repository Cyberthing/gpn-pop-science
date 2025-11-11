import React, { useEffect, useState, useMemo, useCallback } from 'react'
import { useWindowScroll } from "@uidotdev/usehooks";
import { useWindowSize } from "@uidotdev/usehooks";
import { getFullOffsetTop } from '@ips/app/dom-utils'

export const useScrollTracker = (ref, options = {})=>{
  const [{ x, y = 0 }] = useWindowScroll();
  const ws = useWindowSize()
  const [pos, setPos] = useState(0)

  useEffect(()=>{
    if(!ref.current)
      return
    const ofs = getFullOffsetTop(ref.current)
    const h = ((ref.current?.offsetHeight)||0) - (ws.height||500) + (options.extraBottom||0)
    const d = Math.min(100 - 1e-10, (Math.max(0, ((y||0) - ofs))/h * 100))
    setPos(d)
  },[y])

  return pos
}

export default useScrollTracker