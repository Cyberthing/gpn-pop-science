// require('intersection-observer');
import React, { forwardRef, useState, useLayoutEffect, useEffect, useRef } from 'react'
// import Base from './base'

import "./animations.styl"
// import "./emergent.styl"

import useIntersectionObserver from '@ips/react/components/utils/use-intersection-observer'
import { CSSTransition } from 'react-transition-group'

import { genClassName, createStyle } from '@ips/react/components/utils/use-style'
import cx from '@ips/app/classnamex'

const style = createStyle()
const styleClass = genClassName('e')
    // visibility: hidden;
const styleText = `
.${styleClass}{
    opacity: 0;
}

.${styleClass}.ffade-enter,
.${styleClass}.ffade-enter-appear{
    animation: FadeIn linear both;
}

.${styleClass}.ffade-enter-done,
.${styleClass}.ffade-appear-done{
    visibility: visible;
    opacity: 1;
}
`

style.addRaw(styleText)

export const Emergent = forwardRef((p, outref)=>{

    const { className, root, rootMargin } = p

    const ref = useRef()
    if(outref)
        outref.current = ref.current


    const { animation = "ffade", duration = 1, delay = 0, once, ratio=0.03 } = p
    let { mode="toggle" } = p
    if(once)
        mode="once"

    const visible = useIntersectionObserver(ref.current, {mode, ratio, root, rootMargin})
    // trace('visible', visible)

    useLayoutEffect(()=>{
        if(!ref.current)
            return
        ref.current.style.animationDuration = `${duration}s`
        ref.current.style.animationDelay = `${delay}s`
    },[duration, delay])

    return  <CSSTransition 
                timeout={{
                    appear: 0, 
                    enter: duration*1000,
                    exit: 0,
                }}
                // addEndListener={(node, done) => {
                //   node?.addEventListener('animationend', done, false);
                // }}
                classNames={animation}
                in={visible}
                appear
            >
                <div ref={ref} className={cx(className, "ffade" == animation && styleClass)}>
                    { p.children }
                </div>
            </CSSTransition>

})

Emergent.displayName = 'Emergent'

export default Emergent
