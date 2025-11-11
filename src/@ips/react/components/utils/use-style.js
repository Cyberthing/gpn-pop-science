import React, { Component, useRef, useState, useEffect, useContext } from 'react'
import { createStyle, genClassName, flatRule } from '@ips/app/css-utils'
import { isObject, isString } from '@ips/app/hidash'

export { createStyle, genClassName } // re-export

export const useStyle = (style, inRule)=>{

    const ruleText = isObject(inRule)?flatRule(inRule):(isString(inRule)?inRule.trim():'')
    // if(isObject(inRule))
        // trace('gotta flatRule', flatRule(inRule))

    const [uClassName] = useState(genClassName())

    // const rtt = (ruleText||'').trim()
    const [rule] = useState(()=>style.addRule('.'+uClassName, ruleText))

    // end of life - YES IT WORKS!
    // useEffect(()=>()=>style.removeRule(rule),[])

    useEffect(()=>{
        // trace('modify rule', rule, rtt)
        // if(rtt)
            style.modifyRule(rule, ruleText)
        // else
        //     style.removeRule(rule)
    },[ruleText])

    return [uClassName, rule]
}

export const useGlobalStyle = (style, ruleText)=>{
    const rtt = (ruleText||'').trim()
    const [rule] = useState(()=>style.addRaw(rtt))

    // end of life - YES IT WORKS!
    useEffect(()=>()=>style.removeRaw(rule),[])

    useEffect(()=>{
        // trace('modify global rule', rule, rtt)
        // if(rtt)
            style.modifyRaw(rule, rtt)
        // else
        //     style.removeRule(rule)
    },[ruleText])

    return [rule]
}
