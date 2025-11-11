import React, { useRef, useState, useLayoutEffect, useEffect } from 'react'
import { getFullOffsetTop, windowScrollY, parseOffset, windowSize } from '@ips/app/dom-utils'
import { request } from '@ips/app/app-registry'
import cx from '@ips/app/classnamex'
//import { trackPoint } from './utils/vistracker'
// import EE from '@ips/app/event-emitter'

import { ud, times, isDOMElement, isObject, isString } from '@ips/app/hidash'
import throttle from '@ips/app/throttle'

import { useActivation, ActivationContext } from './activation'
// trace('ActivationContext', ActivationContext)

// import useResizeObserver from "use-resize-observer"
import { useRegistry } from './utils/react-app-registry'
import EventEmitter from '@ips/app/event-emitter'

//trace('imported trackit', trackit)

// TODO: generate visboxes from one waypoint to another, covering the whole way
//
//

import './way.styl'

const rebuildPoints = (inPoints, root, edge)=>{
    // if(!this._isMounted)
    //     return

    // trace('rebuildPoints', inPoints)

    // if(!this.context.active)
    //     return

    if(isString(root))
        root  = document.querySelector(root)

    const wayEdge = parseOffset(edge)

    const riaOffset = 0;//Modernizr['topline-ria'] ? 40: (Modernizr['inline-ria'] ? 50 : 0)

    const points = inPoints.map(p=>({ 
            ...p, 
            ofs: getFullOffsetTop(p.el, root) + wayEdge + parseOffset(p.top) + parseOffset(p.edge) - riaOffset
        }))
    points.sort((p1, p2)=>p1.ofs - p2.ofs)

    return points
// 
//     this.setState({ points })
// 
//     if(this.props.onInfo){
//         this.props.onInfo(points)
//     }

}

const decoratePoints = (points, wayopts, opts)=>{
    // trace('decoratePoints', points, opts)
    if(!opts) return
    // const align = decorate.align || 'left'
    const wayEdge = parseOffset(wayopts.edge)
    const name = wayopts.name
    const shift = opts.shift
    // add decorations
    points.forEach((p, i)=>{
        if(!p.el) return
        let deco = p.el.querySelector('.deco')
        if(!deco){
            deco = document.createElement('div')
            deco.className = cx('deco', shift&&('deco_shift'+shift)) 
            p.el.appendChild(deco)
        }

        p.el.style.position = 'relative'

        // deco.style.top = parseOffset(p.edge) + 'px'
        const wpname = `${ name } - ${ i }` + (p.name ? ` - ${p.name}` : '')
        deco.innerText = wpname

        const ofs = parseOffset(p.edge) + wayEdge
        // deco.style.transform = `translateY(${ ofs })`
        deco.setAttribute('data-waypoint', wpname)

        deco.classList.toggle('neg', ofs > 0)

        // if(align == 'right'){
        //     deco.style.left='auto'
        //     deco.style.right = '0px'
        // }
        deco.style.top = Math.min(ofs, 0) + 'px'
        deco.style.bottom = -Math.max(ofs, 0) + 'px'
        // deco.style.height = ofs
    })
}


const scrolledDiscrete = (s, points, cb, continous)=> {
    // if(!this.context.active)
    //     return

    // const { points, continous, cb } = p

    // trace('scrolledDiscrete', s, points)
    for(var i = 0; i < points.length; i++){
        if(points[i].ofs > s)
            break;
    }

    i--

    const d = continous ? (()=>{
        if(i < 0 || i >= points.length - 1) return 0
        return (s - points[i].ofs)/(points[i+1].ofs - points[i].ofs)
    })() : 0

    const c = i + d
    cb(i, c)
}

const isRef = e=>isObject(e)&&(e.hasOwnProperty('current'))

const createWay = p=>{

    const { target, /* spread, */ edge, name, continous, decorate } = p
    const thro = ud(p.throttle) ? 200 : +p.throttle

    let targetEl
    if(target){
        if(target[0] == '$') // it is a selector. otherwise - name (uid)
            targetEl = document.querySelector(target.substr(1))||window
        else if(isDOMElement(target))
            targetEl = target
        else if(isRef(target)){
            targetEl = target.current    
        }
        // else{
        //     const r = await request([target])
        //     trace('way got the scroller', r)
        //     targetEl = r[target].$el||window
        // }
    }else
        targetEl = window
    // trace('targetEl', targetEl, target)

    let current = -1
    const locals = {
        points:[],
        active: true 
    } 

    const ee = new EventEmitter()

    const scrollCb = (i, c)=>{
        if(current != c){
            current = c
            // trace(`wayf ${ name } updated ${ c }`)
            ee.fire('point', { index: i, continous: c })
        }
    }

    const scr = targetEl != window ? ()=>targetEl.scrollTop : windowScrollY
    const scrolled = throttle(()=>locals.active&&scrolledDiscrete(scr(), locals.points, scrollCb, continous), thro)
    targetEl.addEventListener('scroll', scrolled)

    const thRebuildPoints = throttle(()=>{
        locals.points = rebuildPoints(locals.points, p.root, p.edge)
        // trace('thRebuildPoints', locals.points)
        if(p.onInfo)
            p.onInfo(locals.points)
    }, 100)
    const thDecoratePoints = throttle(()=>decoratePoints(locals.points, {name, edge}, decorate), 100)


    if(targetEl == window){
        window.addEventListener('resize', thRebuildPoints)
    }
    const resizeObserver = new ResizeObserver(thRebuildPoints);

    // trace('targetEl', targetEl)
    resizeObserver.observe(targetEl==window?document.body:targetEl);

    // setTimeout(thRebuildPoints, 2000)
    setTimeout(thRebuildPoints, 3000)
    if(p.hcUpdate){
        setInterval(thRebuildPoints, p.hcUpdate)
    }
    

    return {
        ee,
        add: (el, edge, top, spread, pname)=>{
            // trace('wayf added', el)

            locals.points.push({
                el,
                edge: ('undefined' == typeof edge) ? '0' : edge,
                top,
                name:pname
            })

            thRebuildPoints()
            if(decorate)
                setTimeout(thDecoratePoints, 100)
            scrolled()
        },
        remove: (el)=>{
            // trace('removing point', el)
        },
        activate: a=>{
            locals.active = a
        },
        destroy: ()=>{ 
            // TODO
        },
        // decorate:deco=>decoratePoints(locals.points, deco)
    }
}

export const Way = p=>{
    const { name/* , decorate */ } = p
    const [wayda, setWayda] = useState()
    useEffect(()=>{
        // trace('wayda', wayda, p.target.current)
        const way = createWay(p)
        setWayda(way)
        return ()=>way.destroy&&way.destroy()
    },[])
    useRegistry(name, wayda)

    // trace('Way.render')
// 
//     useLayoutEffect(()=>{
//         trace('goin decorate')
//         wayda.decorate(decorate)
//     },[decorate])

    const active = useActivation()
    useEffect(()=>{
        wayda?.activate(active)
    },[wayda, active])

    return null
}

export default Way