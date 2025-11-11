import React, { useState, useEffect } from 'react'
import { register, unregister, request } from '@ips/app/app-registry'
import { ud, isString } from "@ips/app/hidash"

import EventEmitter from '@ips/app/event-emitter'

import useAsync from 'react-use/lib/useAsync'

export const useRegistry = (id, o) =>{
    useEffect(()=>{
        if(ud(id) || !isString(id)) return
        if(!o) return

        register(id, o)

        return ()=>unregister(id, o)

    }, [id, o])
}

export const useEventEmitter = id =>{
    const [val, setVal] = useState()
    // trace('useEventEmitter', id)

    useEffect(()=>{
        if(ud(id) || !isString(id)) return

        const nval = val||{ ee: new EventEmitter() }
        setVal(nval)
        register(id, nval)
        // registerEventEmitter(id, nee)
        // trace('binditrot', nval)

        return ()=>{ 
            unregister(id); 
            // unregisterEventEmitter(id, nee); 
        }

    }, [id])

    return val ? val.ee : null
}

export const useRegistryRequest = id =>{
    const a = useAsync(()=>request([id]))
    return a.loading?undefined:a.value[id]
}

export const useRegistryEvent = (id, event, cb, deps=[]) =>{
    const a = useAsync(()=>request([id]))
    useEffect(()=>{
        if(a.loading)
            return
        let some = a.value[id]
        some = some.ee || some
        some.on(event, cb)
        return ()=>some.off(event, cb)
    },[a, ...deps])
}