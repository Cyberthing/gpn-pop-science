import React, { Component } from 'react'

// import Stickyfill from './lib/stickyfilljs/stickyfill.es6'
// window.Stickyfill = Stickyfill

import Base from '@ips/react/components/base'

import { register, unregister } from '@ips/app/app-registry'
import './sticky.styl'

import throttle from '@ips/app/throttle'

import { getFullOffsetTop, findAncestor, windowScrollY } from '@ips/app/dom-utils'

import { ActivationContext } from './activation'

// import stickybits from 'stickybits'

//<svelte:window on:scroll='onScroll()'/>
// import { getFullOffsetTop, getFullOffsetLeft, windowSize, windowScrollY } from 'dom-utils'

function extend(targetObj, sourceObject) {
    for (var key in sourceObject) {
        if (sourceObject.hasOwnProperty(key)) {
            targetObj[key] = sourceObject[key];
        }
    }
}

const styleOverfixed = {
    position: 'fixed',
    // width:'100%',
    // maxWidth:this.ew + 'px',
    width:'300px',
    top:'0px',
    bottom:'auto'
} 

export class Sticky extends Base{

    render(){
        const p = this.props
        const s = this.state

        const { cover, sizeCover, w100, h100, vh100, top } = p // sizing and position options

        const style = s.style||p.style||{}
        if(top)
            style.top = top

        return <div ref={ ref=> this.$el = ref } className={ `scroll-fixed ${ p.className||'' }${ p.riable ? ' riable':'' }${ s.overFixed ? ' overfixed':'' }${ (cover||sizeCover) ? ' scroll-fixed_cover':'' }${ w100 ? ' scroll-fixed_w100':'' }${ h100 ? ' scroll-fixed_h100':'' }${ vh100 ? ' scroll-fixed_vh100':'' }`} style={style}>
                    { p.children }
                </div>
    }

    created(){
        const { name } = this.props

        if(name)
            register(name, this)

        // if(window.Stickyfill)
        //     Stickyfill.add(this.$el)
        // stickybits(this.$el)

        if(this.props.riable){
            this.initCustomSticky()
        }

    }

    // willUpdate(props, state){
    //     const { scrollState } = state
    //     if(this.state.scrollState != scrollState){ // new scrollstate
    //     }
    // }

    // updated(prevProps, prevState){
    //     const { scrollState } = this.state
    //     if(prevState.scrollState != scrollState){
    //     }
    // }

    destroyed(){
        if(this.props.riable){
            this.shutdownCustomSticky()
        }
    }

    // custom sticky implementation for ria infinity
    initCustomSticky(){
        if(getComputedStyle(this.$el.parentElement).position == 'static')
            this.$el.parentElement.style.position = 'relative'

        trace('initCustomSticky', this.context)

        this.updateSizes()

        // this.ofs = getFullOffsetTop(this.$el.parentElement)
        // this.ph = this.$el.parentElement.offsetHeight

        // this.eh = this.$el.offsetHeight
        // this.dh = this.ph - this.eh

        window.addEventListener('scroll', this.handleScroll)
        window.addEventListener('resize', this.updateSizes)
        this.updateInter = setInterval(this.updateSizes, 2000)
    }

    shutdownCustomSticky(){
        clearInterval(this.updateInter)
        window.removeEventListener('resize', this.updateSizes)
        window.removeEventListener('scroll', this.handleScroll)
    }


    scrollState = -1

    // handleFixedParent = throttle(()=>{
    //     let papa = this.$el.parentElement
    //     let of = false
    //     while(papa){
    //         const cs = getComputedStyle(papa)
    //         of = cs.position == 'fixed'
    //         // trace(papa, of)
    //         if(of) break
    //         papa = papa.parentElement
    //     }

    //     if(this.state.overFixed != of)
    //         this.updateSizes()

    //     this.setState({ 
    //         overFixed:of
    //     })

    // }, 500)

    handleScroll = throttle(()=>{
        if(!this.context.active)
            return

        const { drool } = this.props

        const fixedParent = findAncestor(this.$el.parentElement, p=>getComputedStyle(p).position == 'fixed' ? p : null)

        // if(drool)
            // trace('fixedParent', fixedParent)

        if(fixedParent){
        }

        this.ofs = getFullOffsetTop(this.$el.parentElement, fixedParent)

        // if(drool)
            // trace('ofs', this.ofs)

        // this.handleFixedParent()

        if(this.state.overFixed){
            this.setState({ style: styleOverfixed })
            return
        }

        // TODO: handle fixed parent elements (i.e. ria.ru)


        // TODO: handle width correctly (make it auto)
        const s = windowScrollY()

        if(drool)
            trace('custom sticky scroll', this.ofs, s)


        let scrollState;
        if(s < this.ofs || fixedParent){
            scrollState = -1
        }else
        if(s < (this.ofs + this.dh)){
            scrollState = 0
        }else{
            scrollState = 1
        }

        if(this.state.scrollState != scrollState){

            const style=((scrollState)=>{
                switch(scrollState){
                    case -1:{
                        this.mode='absolute'
                        return{
                            position: 'absolute',
                            maxWidth:'',
                            width:'300px',
                            top:'0px',
                            bottom:'auto',
                        }
                    }
                    case 0:{
                        this.mode='fixed'
                        return {
                            position: 'fixed',
                            // width:'100%',
                            // maxWidth:this.ew + 'px',
                            width:'300px',
                            top:'0px',
                            bottom:'auto'
                        }
                    }
                    case 1:{
                        this.mode='absolute'
                        return {
                            position: 'absolute',
                            maxWidth:'',
                            width:'300px',
                            top:'auto',
                            bottom:'0px'
                        }
                    }
                }
            })(scrollState)

            this.setState({ scrollState, style })
        }
    },0)

    updateSizes = throttle(()=>{
        // return

        if(!this.context.active)
            return

        const { drool } = this.props

        this.ofs = getFullOffsetTop(this.$el.parentElement)
        this.ph = this.$el.parentElement.offsetHeight
        this.pw = this.$el.parentElement.offsetWidth
        if(this.mode=='absolute')
            this.ew = this.$el.offsetWidth
        this.eh = this.$el.offsetHeight
        this.dh = this.ph - this.eh

        if(drool)
            trace('custom sticky', this.ofs, this.ph, this.eh, this.dh)

        this.handleScroll()
    }, 200)
    
}

Sticky.contextType = ActivationContext


//props:["name", "classname", "addstyle", "freesize"],

export default Sticky