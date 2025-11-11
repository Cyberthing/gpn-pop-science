import React, { forwardRef, useRef, useState, useEffect, useContext } from 'react'
import { useMemo, useCallback } from 'use-memo-one'
import useTimeout from '@ips/react/components/utils/use-timeout'
import { useActivation } from '@ips/react/components/activation'
import throttle from '@ips/app/throttle'
import { nop } from '@ips/app/hidash'
import cx from '@ips/app/classnamex'

import { createStyle } from '@ips/app/css-utils'

const style = createStyle('')
style.addRaw(`
    .scrollable-touch {
        -webkit-overflow-scrolling: touch;
    }
`)

// .scrollable-touch {
//   @media (max-width: 768px) {
//     -webkit-overflow-scrolling: touch;
//     // overflow-y: scroll;
//   }
// }


export const Scrollable = forwardRef((p, outref)=>{

    const { auto } = p

    let ref = useRef()
    ref = outref||ref

    const inref = useRef()
    const { onEdge = nop } = p
    const [ pos, setPos ] = useState(-1)
    const active = useActivation()

    const handleScroll = useCallback(throttle(()=>{
        if(!active && pos != -1){
            setPos(-1)
            return
        }
        const st = ref.current.scrollTop
        const wh = ref.current.clientHeight
        const sh = inref.current.scrollHeight
        // trace('handling scroll', st, wh, sh, sh-wh)

        let npos
        if(sh <= wh){
            npos = 3
        }else
        if(st == 0){
            npos = 1
        }else if(st > sh - wh - 1){
            npos = 2
        }else{
            npos = 0
        }

        if(npos != pos){
            // trace('npos', npos)
            setPos(npos)
            onEdge(npos)
        }

    }, p.breaks||100),[onEdge, pos, active])

    // const handleActivation = useCallback(()=>{
    //     if(!active && (pos != -1)){
    //         setPos(-1)
    //         return
    //     }
    // },)

    useEffect(handleScroll, [active])

    useTimeout(handleScroll, 1000, [active])

    return useMemo(()=>(
            <div 
                ref={ref} 
                onScroll={handleScroll} 
                style={{ 
                    width:'100%', 
                    height:'100%', 
                    overflowY:auto?'auto':'scroll',
                }}
                className={cx("scrollable-touch", p.className)}
            >
                <div ref={inref}>{p.children}</div>
            </div>)
            ,[handleScroll, p.children, auto])
})
