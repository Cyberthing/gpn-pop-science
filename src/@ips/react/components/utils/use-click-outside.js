import React, { useEffect } from 'react'
import { ud } from '@ips/app/hidash'


export const useClickOutside = (ref, handler, opts, deps)=>{
  useEffect(
    () => {

      if(!handler)
        return

      opts = opts??{ pre:false, block:true, delay:0 }

      const { pre=false, block=true, delay=0 } = opts

      const bblock = ud(block)?true:block

      const listener = ref?
        event => {
          // Do nothing if clicking ref's element or descendent elements
          if (!ref.current || ref.current.contains(event.target)) {
            return;
          }
          // trace('gunter')
          if(bblock){
            event.stopPropagation()
            event.preventDefault()
          }

          handler(event);
        }:
        null

      const me = pre?'mousedown':'click'
      const te = pre?'touchstart':'touchend'


      let drop = false
      let set = false
      setTimeout(()=>{
        // do nothing if it was cancelled before the timeout (delay)
        if(drop)
          return
        set = true
        document.addEventListener(me, listener);
        document.addEventListener(te, listener);
      },(delay||0)*1000)

      // const blocker = ref?event => {
      //     if (!ref.current || ref.current.contains(event.target)) {
      //       return;
      //     }
      //     event.stopPropagation()
      //     event.preventDefault()
      // }:null

      // if(bblock){
      //   document.addEventListener('click', listener);
      // }

      return () => {
        drop = true
        if(set){
          document.removeEventListener(me, listener);
          document.removeEventListener(te, listener);
        }

        // if(bblock){
        //   document.removeEventListener('click', blocker);
        // }
      };
    },
    // Add ref and handler to effect dependencies
    // It's worth noting that because passed in handler is a new ...
    // ... function on every render that will cause this effect ...
    // ... callback/cleanup to run every render. It's not a big deal ...
    // ... but to optimize you can wrap handler in useCallback before ...
    // ... passing it into this hook.
    deps
  );
}

export default useClickOutside