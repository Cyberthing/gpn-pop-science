import { useRef, useEffect } from 'react'
import { isFunction } from '@ips/app/hidash'
export function useInterval(callback, delay=1000) {
  const savedCallback = useRef()
  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback
  })
  // Set up the interval.
  useEffect(() => {
    function tick() {
      if (isFunction(savedCallback.current)) {
        savedCallback.current()
      }
    }
    if (delay !== null) {
      const id = setInterval(tick, delay)
      return () => clearInterval(id)
    }
  }, [delay])
}
