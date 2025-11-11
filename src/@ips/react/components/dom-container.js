import React, { useRef, useState, useEffect } from 'react'
import { useMemo } from 'use-memo-one'

export const DOMContainer = React.forwardRef((p, outref)=>{
    const { element='div', containerName = '$container', children, ...pp } = p

    const ref = useRef()
    const [ container, setContainer ] = useState()

    useEffect(()=>{
        if(ref.current != container){
            setContainer(ref.current)
        }
        if(outref)
            outref.current = ref.current
    },[ref.current, container, outref])

    const chill = useMemo(()=>{
        const vaprolge = {
            [containerName]:container
        }
        // trace('vapr', vaprolge)
        return container?React.Children.map(children, c=>React.cloneElement(c, vaprolge)):null
    },[container, containerName, children])

    const C = element

    const res = <C ref={ref} {...pp}>{ chill }</C>
    return res
})

DOMContainer.displayName = 'DOMContainer'