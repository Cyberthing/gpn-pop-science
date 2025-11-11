import React, { Component, useState, useMemo, useCallback } from 'react'

import { ActivationContext, Activation, ActivationSingle } from "@ips/react/components/activation"
import * as __ from "@ips/app/hidash"

import { useExprContext } from '@ips/react/components/utils/react-expr'

import './list-activator.styl'


export const listActivator = (list, current)=>(__.isFunction(current)?
    (__.map(list, (cc, i)=>(
        <Activation key={i} active={current(cc, i)}>
            {cc}
        </Activation>
    ))):
    (__.map(list, (cc, i)=>(
        <Activation key={i} active={i == current}>
            {cc}
        </Activation>)))
)

export const listActivatorSingles = (list, current)=>(__.isFunction(current)?
    (__.map(list, (cc, i)=>(
        <ActivationSingle key={i} active={current(cc, i)}>
            {cc}
        </ActivationSingle>
    ))):
    (__.map(list, (cc, i)=>(
        <ActivationSingle key={i} active={i == current}>
            {cc}
        </ActivationSingle>)))
)



export const ListActivator = p=>{

    const { naked } = p
    // const [current, setCurrent] = useState
    const [ useExpr ] = useExprContext() // create a new Expr Context and get a custom useExpr hook from it
    const current = useExpr('current', p.current)
    // trace('list-activator', p, current)
    
    const renderList = useMemo(()=>listActivator(p.children, current),[p.children, current])

    if(naked)
        return renderList

    return (<div className={`list-activator ${ p.cover ? 'list-activator_cover':''} `}>
                    { renderList }
                </div>)
}