import React, { Component, useRef, useState, useEffect, useCallback, useMemo } from 'react'
import EventEmitter from '@ips/app/event-emitter'
import cx from '@ips/app/classnamex'
import { ud } from '@ips/app/hidash'
import throttle from '@ips/app/throttle'

import { getFullOffsetTop, windowSize, windowScrollY, parseOffset } from '@ips/app/dom-utils'
import { register } from '@ips/app/app-registry'

import { useEventEmitter } from './utils/react-app-registry'
import { useResize } from './utils/use-resize'
import { useResizeObserver } from './utils/use-resize-observer'
import createEventTargetHook from './utils/create-event-target-hook'
// import useTimeout from './utils/use-timeout'

import './scroll-tracker.styl'


export class ScrollTrackerC extends Component{

    ee = new EventEmitter()

    constructor(props){
        super(props)
        this.cprops = this.recalc(props, this.state)
        this.cbs = {}
    }

    render(){
        const { children, className } = this.props

        return <div ref={ ref => this.$el = ref } className={ `scroll-tracker ${ className||'' }` }>
                    { children }
                </div>
    }    

    componentDidMount(){
        this.created()
    }

    componentWillUnmount(){
        this.destroyed()
    }

    UNSAFE_componentWillUpdate(props, state){
        this.cprops = this.recalc(props, state)
    }

    componentDidUpdate(prevProps, prevState){
        if( prevProps.boxedge != this.props.boxedge )
            this.calcOffset()
    }

    created(){
        const { name, target, throttle } = this.props

        //trace('scroll-tracker', this)

        this._target = document.querySelector(target)|| window
        const scrollY = (this._target == window) ? windowScrollY : ()=>(this._target.scrollTop||0)

        if(name)
            register(name, this)

        this.calcPadding()
        this.calcOffset()


        // trace('scroll-tracker', this)

        const upda = ()=>{
            if(!this.$el) return
            //trace('composter',  scrollY())

            const y = scrollY()
            const ws = windowSize()

            const node = this.$el
            const ofs = y + this._offset - (getFullOffsetTop(node) + this._paddingTop)
            const height = Math.max(1, node.offsetHeight - (this._paddingTop + this._paddingBottom))
            const newPos = Math.min(1, Math.max(0, ofs/height))
            if(this.pos != newPos){
                this.pos = newPos;
                // trace(this, this.pos)
                this.ee.fire('update', { pos: this.pos, ofs:Math.min(height, Math.max(0, ofs)) })
            }
        }

        this.composter = (+throttle) === 0 ? upda: throttle(upda, ud(throttle) ? 100 : throttle)

        if(Modernizr['browser-firefox'] || Modernizr['browser-safari']){
            // trace('gazapulatri')
            var refreshRate = 30;
            this.updateInterval = setInterval(this.composter, 1000 / refreshRate);
        }else{
            this._target.addEventListener('scroll', this.composter)
        }

        window.addEventListener('resize', this.resized)

    }

    destroyed(){
        if(Modernizr['browser-firefox'] || Modernizr['browser-safari']){
            removeInterval(this.updateInterval)
        }else{
            this._target.removeEventListener('resize', this.resized)
        }

        window.removeEventListener('resize', this.resized)
    }

    calcPadding(){
        const { padding, bottom } = this.props;

        // TODO: parse them separately
        this._paddingTop = padding ? parseOffset( padding, this.$el.offsetHeight ) : 0
        this._paddingBottom = this._paddingTop + (bottom ? -parseOffset( bottom, this.$el.offsetHeight ) : 0);
    }

    calcOffset(){
        const { boxedge, top } = this.props;

        const ws = windowSize()
        // const node = this.$el
        this._offset = top ? (-parseOffset(top, ws.y)) : parseOffset(boxedge, ws.y)// - parseOffset(this.state.edge, node.offsetHeight)

    }

    resized = ()=>{
        this.calcPadding()
        this.calcOffset()
    }

    recalc(props, state){
        const { stops, stopsX, stopsY } = props;

        return {
            stops: _.map((stops||'').split(' '), s=>( s[s.length-1]=='%' ? parseFloat(s.slice(0, s.length-1))*1e-2 : parseFloat(s) )),
            stopsX: _.map((stopsX||'').split(' ')),
            stopsY: _.map((stopsY||'').split(' ')),
        }
    }

    // fire(evt, opts){
    //     if(this.cbs[evt])
    //         _.each(this.cbs[evt], cb=>cb(opts))
    // }

    // on(evt, cb){
    //     this.cbs[evt] = this.cbs[evt]||[]
    //     this.cbs[evt].push(cb)
    // }

}


//props:["name", "throttle", "boxedge", "classname", "padding"],


const calcPadding = ($el, padding, pbottom, ws)=>{
    if(!$el) return {top:0, bottom:0}

    // TODO: parse them separately
    const top = padding ? parseOffset( padding, $el.offsetHeight, ws ) : 0
    const bottom = top + (pbottom ? -parseOffset( pbottom, $el.offsetHeight, ws ) : 0)

    return {top, bottom}
}

const calcOffset = (boxedge, top, ws)=>{
    ws = ws||windowSize()
    // const node = this.$el
    return top ? (-parseOffset(top, ws.y, ws)) : parseOffset(boxedge, ws.y, ws)// - parseOffset(this.state.edge, node.offsetHeight)
}

export const ScrollTracker = p=>{
    const { overlay, cover } = p
    const ref = useRef()
    const ee = useEventEmitter(p.name)
    const ws = useResize()
    const [ padding, setPadding ] = useState({ top: 0, bottom: 0, offset: 0 })
    const updatePadding = ()=>{
        if(!ref.current)
            return

        const s = calcPadding(ref.current, p.padding, p.bottom)
        s.offset = calcOffset(ref.current, p.boxedge, p.top)
        setPadding(s)
    }

    useEffect(updatePadding,[])
    useResize(updatePadding)
    useResizeObserver(ref, null, updatePadding, [])

    const target = document.querySelector(p.target)|| window
    const useTargetEvent = useMemo(()=>createEventTargetHook(target), [target])
    const scrollY = useMemo(()=>((target == window) ? windowScrollY : ()=>(target.scrollTop||0)), [target])

    const [pos, setPos] = useState()

    // const [scrollHandler, setScrollHandler] = 

    // trace('ScrollTrackerF', ee, offset, padding)

    const updater = useMemo(()=>{
        // trace('rememing', ee)
        if(!ref.current) return
        if(!ee) return

        // local current pos
        let pos;

        // trace('direp')
        const upda = ()=>{
            // trace('upda', ee)
            // trace('upda2',  scrollY())

            const y = scrollY()
            const ws = windowSize()

            const node = ref.current
            const ofs = y + padding.offset - (getFullOffsetTop(node) + padding.top)
            const height = Math.max(1, node.offsetHeight - (padding.top + padding.bottom))
            const newPos = Math.min(1, Math.max(0, ofs/height))
            // trace(ofs, height, newPos)
            if(pos != newPos){
                pos = newPos
                // trace(newPos)
                ee.fire('update', { pos: newPos, ofs:Math.min(height, Math.max(0, ofs)) })
            }
        }

        return (+p.throttle) === 0 ? upda: throttle(upda, ud(p.throttle) ? 100 : p.throttle)
    },[ref.current, p.throttle, padding, ee])

    // trace('updater', updater)
    useTargetEvent('scroll', updater)
    // useTimeout(updater, 5000)

    const { children, className } = p
    return <div ref={ref} style={p.style} className={cx('scroll-tracker', className, cover&&'scroll-tracker-cover', overlay&&'scroll-tracker-overlay')}>
                { children }
            </div>

}

// export default ScrollTrackerF
export default ScrollTracker
