import React, { useRef, useEffect, useLayoutEffect, forwardRef } from 'react'
import { useMemo } from 'use-memo-one'
import cx from '@ips/app/classnamex'
import { objEach } from '@ips/app/hidash'

export const ApplyClassName = forwardRef((p, outref)=>{
    // trace('ApplyClassName', p)
    const { children, className, ...pp } = p
    const ref = useRef()
    const onlyChild = React.Children.only(children)

    useLayoutEffect(()=>{
        if(outref)
            outref.current = ref.current
    },[ref.current, outref])

    useLayoutEffect(()=>{
        if(!ref.current || !ref.current.classList)
            return

        if(!className)
            return

        const cur = ref.current
        const cc = className.split(' ')
        // setTimeout(()=>cur.classList.add(className),0)
        cur.classList.add(...cc)

        return ()=>cur.classList.remove(...cc)
    },[className, onlyChild])

    return useMemo(()=>React.cloneElement(onlyChild, { ref, ...pp }), [onlyChild])
})

ApplyClassName.displayName = 'ApplyClassName'


export const ToggleClassName = forwardRef((p, outref)=>{
    // trace('ToggleClassName', p)
    const { on, children, className, ...pp } = p
    const ref = useRef()
    const onlyChild = React.Children.only(children)

    useLayoutEffect(()=>{
        if(outref)
            outref.current = ref.current
    },[ref.current, outref])

    useLayoutEffect(()=>{
        if(!ref.current || !ref.current.classList)
            return

        if(!className)
            return

        const cc = className.split(' ')

        const cur = ref.current
        // setTimeout(()=>{
            if(on)
                cur.classList.add(...cc)
            else
                cur.classList.remove(...cc)
        // },0)
    },[className, onlyChild])
    
    return useMemo(()=>React.cloneElement(onlyChild, { ref, ...pp }), [onlyChild])
})

ToggleClassName.displayName = 'ToggleClassName'


export const ApplyStyle = forwardRef((p, outref)=>{
    // trace('ApplyStyle', p)
    const { children, style, ...pp } = p
    const ref = useRef()

    useEffect(()=>{
        if(outref)
            outref.current = ref.current
    },[ref.current, outref])

    useEffect(()=>{
        if(!ref.current || !ref.current.style)
            return

        if(!style)
            return

        const cur = ref.current
        setTimeout(()=>objEach(style, (v, s)=>cur.style[s]=v),0)

        return ()=>objEach(style, (v, s)=>cur.style[s]=null)
    },[style])

    const onlyChild = React.Children.only(children)
    
    return useMemo(()=>React.cloneElement(onlyChild, { ref, ...pp }), [onlyChild])
})

ApplyStyle.displayName = 'ApplyStyle'


export const ToggleStyle = forwardRef((p, outref)=>{
    // trace('ToggleStyle', p)
    const { on, children, style, ...pp } = p
    const ref = useRef()

    useEffect(()=>{
        if(outref)
            outref.current = ref.current
    },[ref.current, outref])

    useEffect(()=>{
        if(!ref.current || !ref.current.style)
            return

        if(!style)
            return

        const cur = ref.current
        setTimeout(()=>{
            if(on)
                objEach(style, (v, s)=>cur.style[s]=v)
            else
                objEach(style, (v, s)=>cur.style[s]=null)
        },0)
    },[on, style])

    const onlyChild = React.Children.only(children)
    
    return useMemo(()=>React.cloneElement(onlyChild, { ref, ...pp }), [onlyChild])
})

ToggleStyle.displayName = 'ToggleStyle'

