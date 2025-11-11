import React, { useState, useEffect, useContext, forwardRef } from 'react'
import { useMemo, useCallback } from 'use-memo-one'
// import { createTextStyle, removeTextStyle } from '@ips/app/font-utils'
import { TextStyleContext } from '@ips/react/components/utils/use-text-style'
import * as __ from '@ips/app/hidash'
import uniqueNumber from '@ips/app/unique-number'

import { useScene } from '@ips/react/components/utils/use-scene'

export const TextStyle = forwardRef((p, ref)=>{

    const { uid, children, className, ...props } = p // removing unused stuff

    const scene = useScene()

    const cuid = useMemo(()=>("c" + uniqueNumber()),[])
    // trace('TextStyle', uid)

    const textStyles = useContext(TextStyleContext)

    // once in the beginning
    const [ ts, setTs ] = useState()//()=>textStyles.create(p, cuid))

    // on update
    useEffect(()=>{
        // if(ts)
        //     textStyles.remove(props.name)
        // trace('updating text style', cuid, props.name, props)
        setTs(textStyles.create(props, cuid, scene.config))
        return ()=>ts?textStyles.remove(cuid):null
    },[scene.config])

    // end of life
    // useEffect(()=>{
    //     return ()=>textStyles.remove(cuid)
    // },[])

    return null
})
TextStyle.displayName='TextStyle'

export default TextStyle