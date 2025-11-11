import React, { Fragment, Component, forwardRef, useRef, createRef, useState, useEffect, useLayoutEffect, useContext } from 'react'
import { useMemo, useCallback } from 'use-memo-one'
import { CSSTransition } from 'react-transition-group'
import { Display } from './display'
import { nop, times, each } from '@ips/app/hidash'
import cx from '@ips/app/classnamex'
import { useExprContext } from '@ips/react/components/utils/react-expr'
import { Opacity0 } from './opacity0'
import { ApplyClassName, ToggleClassName } from './ref-apply'
import { Overlay } from './overlay'
import useUpdate from 'react-use/lib/useUpdate'

// export const TransLayerDrop = p=>{
//     const { cache, children, transition, onTransition, onTransitionEnd, duration=500 } = p
//     const [ pos, setPos ] = useState([children,children])
// 
//     const locals = useMemo(()=>({
//         current:children,
//         pos:[children, children],
//         flipper:0,
//     }),[])
// 
//     useMemo(()=>{
//         if(children == locals.current)
//             return
//         locals.current = children
//         locals.pos[locals.flipper]=children
//         locals.flipper = (locals.flipper+1)%2
//         setPos(locals.pos)
//     }, [children])
// 
//     return <Fragment>
//             <CSSTransition
//               timeout={duration}
//               classNames={transition}
//               in={Boolean(locals.flipper)}
//               onEnter={onTransition}
//               onEntered={onTransitionEnd}
//             >
//                 { pos[0] }
//             </CSSTransition>
//             <CSSTransition
//               timeout={duration}
//               classNames={transition}
//               in={!Boolean(locals.flipper)}
//             >
//                 { pos[1] }
//             </CSSTransition>
//         </Fragment>
// }

const notn = <></>
let keyban = 0
const getNewKey = ()=>keyban++

export const TransLayerDrop = forwardRef((p, ref)=>{
    const { cache, children = notn, naked, transition, onTransition, onTransitionEnd, duration=500, updateKey } = p

    // const refCurrent = useRef()
    // const refPrevious = useRef()

    const refs = useMemo(()=>times(2, createRef),[])
    // trace('refs', refs)

    const locals = useMemo(()=>({
        updateKey:undefined,
        pos:[notn, notn],
        // rekeys:[],
        flipper:0,
    }),[])

    const update = useUpdate()

    if(updateKey != locals.updateKey){
        // Flip the layers
        locals.flipper = (locals.flipper+1)%2
        locals.updateKey = updateKey
        locals.newC = children
        locals.pos[locals.flipper] = React.cloneElement(React.Children.only(children), { ref:refs[locals.flipper] })
        update()
        // trace('TransLayerFlop', updateKey, locals.pos)
    }else if(locals.newC != children){
        // Just update the current layer
        locals.newC = children
        locals.pos[locals.flipper] = React.cloneElement(React.Children.only(children), { ref:refs[locals.flipper] })
        update()
    }
    
    // trace('TransLayer current', children)

    useLayoutEffect(()=>{
        // trace('refCurrent', refCurrent.current)
        if(refs[0].current){
            refs[0].current.style.top='0'
            refs[0].current.style.position = locals.flipper?'absolute':null
            refs[0].current.style.pointerEvents = locals.flipper?'none':null
            refs[0].current.style.animationDuration = `${duration*0.001}s`
        }
        if(refs[1].current){
            refs[1].current.style.top='0'
            refs[1].current.style.position = !locals.flipper?'absolute':null
            refs[1].current.style.pointerEvents = !locals.flipper?'none':null
            refs[1].current.style.animationDuration = `${duration*0.001}s`
        }
    })


    // const rewrap = (c, ref)=>React.cloneElement(React.Children.only(c), { ref })

    const core = (<>
        <CSSTransition
          timeout={duration}
          // timeout={{
          //   appear: 0, 
          //   enter:duration,
          //   exit:duration,
          // }}
          classNames={transition}
          in={!Boolean(locals.flipper)}
          unmountOnExit
          onEnter={onTransition}
          onEntered={onTransitionEnd}
        >
            { locals.pos[0] }
        </CSSTransition>
        <CSSTransition
          timeout={duration}
          classNames={transition}
          in={Boolean(locals.flipper)}
          unmountOnExit
        >
            { locals.pos[1] }
        </CSSTransition>
    </>)

    if(naked)
        return core

    return <div ref={ref}>
                {core}
            </div>
})

// TASK: 
// - render a list of children
// - dispay: none for those which are not current or previous
// - CSSTransition for cur and prev

const Banananas = forwardRef((p, ref)=><ToggleClassName className="display_none opacity_0" {...p}/>)


// TODO: on redraw cycle frame by frame through all the layers. dont just set them all to visible

export const TransLayer = p=>{
    const { frames, transition, duration, onTransition = nop, onTransitionEnd = nop, displaySwitch, displayAlways } = p
    const locals = useMemo(()=>({
        current:null,
        prev:null
    }),[])

    const [redraw, setRedraw] = useState()
    const [ inTransition, _setInTransition ] = useState(false)
    const setInTransition = useRef(is=>{
        if(locals.inTransition != is){
            locals.inTransition == is
            _setInTransition(is)
        }
    }).current

    // const [ tralivali, setTralivali ] = useState([])
// React.children(children)[current]

    // const frameRefs = useMemo(()=>times(frames.length, ()=>({})), [frames.length])

    // const [ useExpr ] = useExprContext()
    const current = p.current//useExpr('current', p.current)||0 // fixing NaNs

    // trace('TransLayer current', current, 'transition', transition, 'duration', duration, 'displaySwitch', displaySwitch)

    const tra = useMemo(()=>{
        // const chill = children//React.Children.toArray(children)
        // const cur = chill[current]
        // if(current == locals.current && locals.transition == transition){
        //     trace('equals')
        //     return null
        // }
        // trace('guba', 'current', current, 'transition', transition, 'duration', duration, locals.prev, locals.current)
        // trace('tra', locals.inTransition)

        if(locals.current != current){
            locals.inTransition = true
        }
        locals.prev = locals.current
        locals.current = current

        // const D = (displaySwitch||Display)
        // trace('TransLayer current', current, redraw)

        const onEnter = ()=>{

            // trace('TransLayer onEnter')
            // setInTransition(true)
            onTransition()
        }

        const onEntered = ()=>{
            // trace('TransLayer onEntered')
            onTransitionEnd()
            setInTransition(false)
        }

        // const dirIdx = locals.prev < locals.current ? 0 : 1
        const tra = frames.map((c, i)=>{
            const dasIstIch = i == current
            const soyElPrevio = i == locals.prev
            const visible = dasIstIch||(soyElPrevio&&locals.inTransition)

            const Trans = CSSTransition

                        // nodeRef={frameRefs[i]}
            return  <Trans
                        key={i}
                        timeout={duration}
                        classNames={transition}
                        in={dasIstIch}
                        appear={true}
                        onEnter={dasIstIch ? onEnter : null}
                        onEntered={dasIstIch ? onEntered : null}
                    >
                        <ApplyClassName className={visible?'':(redraw?"opacity_0":cx(!displayAlways&&"display_none", "opacity_0"))}>
                            {c}
                        </ApplyClassName>
                    </Trans>
        })

        return tra
    }, [frames, current, transition, duration, displaySwitch, redraw, inTransition])

    useMemo(()=>{
        if(!redraw && p.redraw){
            // trace('TransLayer redraw')
            setRedraw(true)
        }
    },[p.redraw, redraw])

    useEffect(()=>{
        if(redraw){
            // trace('dropping redraw', redraw)
            setRedraw(false)        
        }
    },[redraw])

    // if(tralivali != tra)
    //     setTralivali(tra)

    // trace('frameRefs', frameRefs)

    // useEffect(()=>{
    //     each(frameRefs, (fr, i)=>fr.current&&(fr.current.style.display=(i==locals.prev || i == locals.current)?'':'none'))
    // })

    // useEffect(()=>bind({
    //     current,
    //     setCurrent,
    // }), [current])

    return <Fragment>{ tra }</Fragment>

}

export default TransLayer