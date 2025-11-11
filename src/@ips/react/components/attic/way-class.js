import React, { useRef, useLayoutEffect, useEffect } from 'react'
import Base from './base'
import { getFullOffsetTop, windowScrollY, parseOffset, windowSize } from '@ips/app/dom-utils'
import { request } from '@ips/app/app-registry'
import cx from '@ips/app/classnamex'
//import { trackPoint } from './utils/vistracker'
// import EE from '@ips/app/event-emitter'

import { times, isDOMElement, isString } from '@ips/app/hidash'
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


import './way-class.styl'

const ud = v => 'undefined' == typeof v

export class Way extends Base{

    state = { points: [] }

    add(el, edge, top, spread, name){
        // trace('added', el)

        let points = this.state.points||[]
        points.push({
            el,
            edge: ('undefined' == typeof edge) ? '0' : edge,
            top,
            name
            // ofs: getFullOffsetTop(el),
        })

        // const ws = windowSize()

        // points = _.sortBy(_.map(points, p=>({ ofs: getFullOffsetTop(p.el) + parseOffset(p.edge), edge:p.edge, el:p.el })), 'ofs')
        // points = _.sortBy(_.map(points, p=>({ ...p, ofs: getFullOffsetTop(p.el) })), 'ofs')
        this.setState({ points })
        this.resize()
        // this.rebuild(points)
    }

    remove(el){
        // trace('removing point', el)
    }

    recalc(props, state, force, prevContext){
        // trace('Way recalc', prevContext, this.context)
        let cprops = super.recalc(props, state, force)

        const { spread, spreadTrim, name } = props
        cprops.spreadPoints = times(spread, i =><div key={ i } className={`waypoint waypoint_over waypoint_${ name }-${ i+1 }`} style={{ top: `${ (i/(spread-(spreadTrim ? 1:0))*100)|0 }%` }}/>) 
        return cprops
    }

    render(){
        // trace('Way.render', this.activationContext)
        const { children, name, cover } = this.props
        const { spreadPoints } = this.cprops
        return (<div 
            ref={ ref=> this.$el = ref } 
            className={`way ${ cover ? 'way_cover':'' }`} 
            style={{ position:'relative', width:'0px' }} 
            data-name={ name }>
            { children }
            { spreadPoints }
        </div>)
    }

    async created(){
        super.created()

        const { target, spread, edge, name, continous } = this.props

        // trace('way', name, this)

        if(target){
            if(target[0] == '$') // it is a selector. otherwise - name (uid)
                this.targetEl = document.querySelector(target.substr(1))||window
            else{
                const r = await request([target])
                trace('way got the scroller', r)
                this.targetEl = r[target].$el||window
            }
        }else
            this.targetEl = window

        // times(spread, i =>{

        //     const sel = document.createElement('div')
        //     el.parentElement.appendChild(sel)
        //     points.push({
        //         sel,
        //         edge: ('undefined' == typeof edge) ? '0' : edge,
        //         top: i + '%',
        //         // ofs: getFullOffsetTop(el),
        //     })
        // })

        const points = [...this.$el.querySelectorAll('.waypoint')].map((p, i)=>({
            el:p,
            edge:  ('undefined' == typeof edge) ? '0' : edge,
        }))
        if(points.length)
            this.rebuild(points)

        // this.targetEl = document.querySelector(target)||window
        const scr = this.targetEl != window ? ()=>this.targetEl.scrollTop : windowScrollY

        const scrolled = this.scrolledDiscrete//continous ? this.scrolledContinous : this.scrolledDiscrete
        scrolled(scr()) // set initial

        this._scrolled = throttle(()=>scrolled(scr()), ud(this.props.throttle) ? 200 : +this.props.throttle)
        this.targetEl.addEventListener('scroll', this._scrolled)
        window.addEventListener('resize', this.resize)

        // hardcore update sizes. TODO: rebuild this on MutationObserver or somn
        if(this.props.hcupdate)
            this.updateLoop = setInterval(()=>{
                const { points } = this.state
                this.rebuild(points)
            }, 2000)

        // this.reb = ()=>{
        //     const { points } = this.state
        //     this.rebuild(points)
        // }

        // trace('pilili', this)

        // setTimeout(this.reb, 2000)
    }

    // updated(prevProps, prevState, prevCtx){
    //     // trace('Way.updated', prevCtx, this.context)
    // }

    destroyed(){
        trace('Way.destroyed')
        super.destroyed()
        clearInterval(this.updateLoop)
        window.removeEventListener('resize', this.resize)
        this.targetEl.removeEventListener('scroll', this._scrolled)
    }

    scrolledDiscrete = s => {
        if(!this.context.active)
            return

        const { continous } = this.props
        const { points } = this.state

        // trace('scrolledDiscrete', this.props.name, this)
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

        if(this.current != c){
            this.current = c
            // if(this.state.current != i)
            //     this.setState({ current: i })

            // trace(`way ${ this.props.name } updated ${ c }`)
            this.ee.fire('point', { index: i, continous: c })
        }
    }

    resize = throttle(()=>{
        // if(!this._isMounted)
        //     return

        const { points } = this.state
        trace('way resize', points)
        this.rebuild(points)
        this._scrolled()
    }, 100) // this is huge but it often doesn't catch before rebuild. TODO: update on mutation or somn

    rebuild(inPoints){
        // if(!this._isMounted)
        //     return

        // trace('way rebuild', inPoints)

        if(!this.context.active)
            return

        const { name, decorate } = this.props

        const root  = this.props.root ? document.querySelector(this.props.root) : null

        const wayEdge = parseOffset(this.props.edge)

        const riaOffset = 0;//Modernizr['topline-ria'] ? 40: (Modernizr['inline-ria'] ? 50 : 0)

        const points = inPoints.map(p=>({ 
                ...p, 
                ofs: getFullOffsetTop(p.el, root) + wayEdge + parseOffset(p.edge) - riaOffset
            }))
        points.sort((p1, p2)=>p1.ofs - p2.ofs)

        this.setState({ points })

        if(this.props.onInfo){
            this.props.onInfo(points)
        }

        if(decorate){
            // const align = decorate.align || 'left'
            const shift = decorate.shift
            // add decorations
            inPoints.forEach((p, i)=>{
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
    }

}

Way.contextType = ActivationContext

export default Way