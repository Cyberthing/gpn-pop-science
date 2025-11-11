// require('intersection-observer');
import React from 'react'
import Base from './base'

import "./animations.styl"
import "./emergent.styl"
import { getFullOffsetTop, windowScrollY, windowSize } from '@ips/app/dom-utils'


function runCssAnim($el, animation = 'FadeIn', duration = 1, delay = 0){
    const runner = {
    }

    const end = ()=> {
        $el.removeEventListener('animationend', end)
        $el.removeEventListener('webkitAnimationEnd', end)
        runner.resolve()
    }
    
    const promise = new Promise((resolve, reject)=>{
        runner.resolve = resolve
        $el.style.animationName = animation
        $el.style.animationDuration = duration +'s'
        $el.style.animationDelay = delay + 's'
        $el.addEventListener('animationend', end)
        $el.addEventListener('webkitAnimationEnd', end)
    })

    runner.promise = promise
    runner.cancel = ()=>runner.resolve()
    runner.clear = ()=>{ 
        runner.cancel()
        $el.style.animationName = ''
        $el.style.animationDuration = ''
        $el.style.animationDelay = ''
    }
    return runner
}


export class Emergent extends Base{

    // recalc(props, state, force){
    //     let cprops = super.recalc(props, state, force)
    // }
    state = {
        visible:false,
    }

    // recalc(props, state, force){
    //     const { visible } = state

    //     let cprops = super.recalc(props, state, force)
    //     const { animation, duration, delay, smooth, immediate } = props
    //     cprops.animation = animation||'FadeIn'
    //     cprops.duration = duration||1
    //     cprops.delay = delay||0

    //     // if(this.$el && visible != this.state.visible){
    //     //     const style = { animation: visible ? `${ cprops.animation } linear ${ cprops.duration }s ${ cprops.delay }s both` : '' }
    //     //     this.setState({ style })
    //     // }

    //     return cprops
    // }

    render(){
        const { children } = this.props
        const { style } = this.state

        const p = this.props
        const s = this.state

        return  <div ref={ ref => this.$el = ref } className={ `emergent ${ s.className||p.className||'' }` } style={ style }>
                    { children }
                </div>
    }

    created(){
        // trace('emergent created', this)

        // console.log('oncreate', this)

        // this.set({ visible:true })

        let options = {
            root: null,
            // rootMargin: "0px",
            // threshold: .5//buildThresholdList()
        }

        const handleIntersect = inters =>{
            // console.log('inters', this, inters)
            const vis = inters[0].intersectionRatio > 0
            // if(this.state.visible && !vis){

            //     setTimeout(()=>{
            //         if(this.state.delayedInvisible)
            //             this.setState({ delayedInvisible:false, visible: false})    
            //     }, 1000)
            //     this.setState({ delayedInvisible: true })
            // }else
            // if(!this.state.visible && vis)
            //     this.setState({ delayedInvisible:false, visible:vis })

            this.setState({ visible:vis })
        }

        const observer = new IntersectionObserver(handleIntersect, options)
        observer.observe(this.$el)
    }

    async updated(prevProps, prevState){
        const { visible } = this.state
        const { smooth, animation, instant, duration, delay } = this.props

        if(visible){
            if(!prevState.visible){
                if(this.runner){
                    if(instant){
                        this.runner.cancel()
                    }
                    else{
                        await this.runner.promise
                    }
                    this.runner = null
                }
                this.runner = runCssAnim(this.$el, animation, duration, delay)
                this.$el.style.visibility = 'visible'
            }
        }else{
            if(prevState.visible){
                if(this.runner){
                    this.runner.clear()
                    this.runner = null
                }
                this.$el.style.visibility = 'hidden'
            }
        }
    }

}

export default Emergent