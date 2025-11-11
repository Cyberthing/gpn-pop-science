import React, { useState, useRef } from 'react';
import { useCallback, useMemo } from 'use-memo-one'
import createEventTargetHook from './create-event-target-hook';

import { useInterval } from './use-interval'

const useWindow = createEventTargetHook(window);

const getSize = ()=>({
        width: window.innerWidth,
        height: window.innerHeight
      })

const getWindowsNoScrollSize = ()=>({
        width: window.innerWidth - 17,
        height: window.innerHeight
      })

export const useResize = (cb, { ria, noScrollbar, delay=500, intervalDelay=2000 }={}) => {

  // const handler = useCallback(() =>
  //   setSize({
  //     width: window.innerWidth,
  //     height: window.innerHeight - ria ? 170 : 0
  //   }), [ria])

  const [size, setSize] = useState((noScrollbar&&Modernizr['platform-windows']) ? 
    getWindowsNoScrollSize : getSize);

  const locals = useRef({s:{}}).current
  const updateSize = useRef(s=>{
    // if(locals.s.width != s.width || locals.s.height != s.height)
    {
      locals.s = s
      setSize(s)
    }
  }).current

  const handler = useMemo(()=>{
    const wsMethod = (noScrollbar&&Modernizr['platform-windows'])?getWindowsNoScrollSize:getSize
    return ()=>setTimeout(()=>updateSize(wsMethod()), delay)
  }, [noScrollbar])

  // Had to do it because of the mobiles. Otherswise it doesn't update properly
  // TODO: useResizeObserver instead
  // useInterval(intervalDelay>0?handler:null, intervalDelay)
  
  useWindow('resize', handler);
  useWindow('resize', cb)
  return size;
};
export default useResize;
