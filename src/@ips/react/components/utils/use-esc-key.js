import React from 'react'
import { useCallback } from 'use-memo-one'
import createEventTargetHook from '@ips/react/components/utils/create-event-target-hook'

const useWindowEvent = createEventTargetHook(window)

export default cb=>{

    const meh = useCallback(e=>{
        if(!cb) return
        if(e.key == 'Escape'){
            cb()
        }
    },[cb])

    useWindowEvent('keyup', meh)
}
