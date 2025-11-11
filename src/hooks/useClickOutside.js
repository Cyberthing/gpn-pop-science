import { useEffect } from 'react'

const blocker = event=>{
    event.stopPropagation()
    event.preventDefault()
}


export const useClickOutside = (ref, handler, opts, deps)=>{
  // console.log('useClickOutside', ref, opts, handler)
  useEffect(() => {

      if(!handler)
        return

      opts = opts??{ pre:true, block:false, delay:0 }

      const { pre, block, delay=0 } = opts

      const ppre = pre ?? true

      const listener = event => {
        // Do nothing if clicking ref's element or descendent elements
        if (!ref.current || 
          ref.current == event.target || 
          ref.current.contains(event.target)
        ) {
          return;
        }

        if(block){
          blocker(event)
        }

        // console.log('useClickOutside')
        handler(event);
      }

      // console.log('block', block, bblock)
      // console.log('pre', pre, ppre)

      {/* const evt = ppre?'pointerdown':'pointerup' */}
      const evt = 'click'
      //ppre?'pointerdown':'pointerup'
      //const blockevents = ppre ? ['mousedown', 'touchstart'] : ['click', 'touchend']
      //const blockevents = ['mousedown', 'touchstart', 'click', 'touchend']
      const blockevents = []
      // const me = pre?'mousedown':'click'
      // const te = pre?'touchstart':'touchend'

      const destructors = []
      let drop = setTimeout(()=>{
        // do nothing if it was cancelled before the timeout (delay)
        // if(drop)
        //   return

        // document.addEventListener(me, listener);
        // document.addEventListener(te, listener);
        // destructors.push(()=>document.removeEventListener(me, listener))
        // destructors.push(()=>document.removeEventListener(te, listener))

        document.addEventListener(evt, listener);
        destructors.push(()=>document.removeEventListener(evt, listener))
        blockevents.forEach(e=>{
          document.addEventListener(e, blocker)
          destructors.push(()=>document.removeEventListener(e, blocker))
        })

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
        clearTimeout(drop)
        // drop = true
        destructors.forEach(d=>d())
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