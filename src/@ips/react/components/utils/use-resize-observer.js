import React, { useState, useEffect, useLayoutEffect } from 'react'
import useUpdate from 'react-use/lib/useUpdate'
import { ident, isDOMElement } from '@ips/app/hidash'

const defCon = { box : 'border-box' }
export const useResizeObserverState = (ref, conconfig, changes)=>{
    let { transform=ident, initial, onUpdate, ...config} = conconfig||{}
    config = {...defCon, ...config}
    const [value, setValue] = useState(initial)

    useLayoutEffect(()=>{
        if(!ref.current)
            return
        const update = (e)=>{
            const val = transform(e, ref.current)
            setValue(val)
            if(onUpdate)
                onUpdate(val)
        }
        const resizeObserver = new ResizeObserver(update);
        resizeObserver.observe(ref.current, config);
        return ()=>resizeObserver.disconnect()
    },changes)

    return value
}

export const useResizeObserver = (ref, conconfig, cb, changes)=>{
    let config = conconfig||{}
    config = {...defCon, ...config}

    // const update = useUpdate()
    // useEffect(()=>{
    //     update()
    // },[])

    useLayoutEffect(()=>{
        // trace('werehere', ref)
        const $el = !ref?null:isDOMElement(ref.current)?ref.current:isDOMElement(ref)?ref:null
        if(!$el)
            return

        const $sel = config.select?config.select($el):$el
        const resizeObserver = new ResizeObserver(cb);
        resizeObserver.observe($sel, config);
        return ()=>resizeObserver.disconnect()
    },changes)
}

export const useResizeObserverMultiple = (refs, config, cb, changes)=>{
    // const [muru, setMuru] = useState()
    useLayoutEffect(()=>{
        const resizeObservers = []
        refs.forEach(ref=>{
            const $el = ref.current
            if(!$el)
                return
            const resizeObserver = new ResizeObserver(cb);
            resizeObserver.observe($el, config);
            resizeObservers.push(resizeObserver)
        })
        return ()=>resizeObservers.forEach(ro=>ro.disconnect())
    },changes)
}

export default useResizeObserver