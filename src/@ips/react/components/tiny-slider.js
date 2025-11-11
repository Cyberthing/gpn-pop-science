import React, { createRef } from 'react'
import Base from 'components/base'
import { register, request } from '@ips/app/app-registry'

import { loadScript, loadStyleLinkCb } from '@ips/app/utils'

import * as __ from '@ips/app/hidash'

import tns from "./lib/tiny-slider/tiny-slider"
// import "./lib/tiny-slider/tiny-slider.css"

let __tns = null
Promise.all([
    // loadScript("https://cdnjs.cloudflare.com/ajax/libs/tiny-slider/2.9.2/min/tiny-slider.js"), 
    loadStyleLinkCb("https://cdnjs.cloudflare.com/ajax/libs/tiny-slider/2.9.2/tiny-slider.css")])
    .then(()=>{
        trace('tns loaded', tns)
        __tns = tns
        register('tiny-slider', __tns)
    })

export class TinySlider extends Base{

    tnsCon = createRef()


    recalc(props, state){
        const { className, children, current, nowrap } = props;

        return {
            className: `ips-tiny-slider ${ className }`,
            wchildren: children,
        }
    }

    render(){
        const { className,wchildren } = this.cprops
        const { reverse, pagination, children } = this.props

        return ( <div className={ className }>
                   <div className="ips-tiny-container" dir={ reverse ? 'rtl': null } ref={ this.tnsCon }>
                        { children }
                    </div>
                </div> )
    }

    async created(){
        super.created()
        await this.updateInstance()

        const { current, onReady=__.nop } = this.props


        this.renderExpr('current', current, v => this.setState({ current: v }))


        trace('tinySlider', this)
        
        onReady()
    }

    // willUpdate(){
    // }

    async updated(prevProps, prevState){
        trace('TinySlider updated', this.tns)

        await this.updateInstance()

        const { current } = this.state
        if(this.tns && current != prevState.current){
            trace('gointo', current)
            this.tns.goTo(current, 400)
        }
    }

    async updateInstance(){
        const curTnsCon = this.tnsCon.current
        if(this.prevTnsCon == curTnsCon){
            if(this.tns)
                this.tns.disable()
                this.tns.refresh()
                this.tns.enable()
            return
        }

        this.prevTnsCon = curTnsCon

        if(this.waitage) return

        this.waitage = true

        const res = await request(['tiny-slider']);
        const tnsFactory = res['tiny-slider']

        trace('TinySlider updateInstance', this.tnsCon.current)
        if(this.tns){
            this.tns.destroy();
            this.tns = null;
        }

        const { controls, nav, loop } = this.props
        const { current } = this.state

        if(this.tnsCon.current){
            this.tns = tnsFactory({
                container: this.tnsCon.current,
                // "autoWidth": true,
                controls,
                nav,
                loop,
                rewind:loop,
                index: (+current)||0,
                "items": 1,
                "gutter": 0,
                "mouseDrag": true,
                "swipeAngle": false,
                "speed": 400,
                // mode:'gallery'
              });

            this.tns.events.on('indexChanged', (e,b)=>{
                if(this.state.current != e.index){
                    this.setState({current: e.index})
                    this.ee.fire('change', {index:e.index})
                }
            })
        }

        this.waitage = false
    }    
}


// const buildTnsInstance = async ()=>{

//         await request(['tiny-slider']);

//         if(this.tns){
//             this.tns.destroy();
//             this.tns = null;
//         }

//         const { controls, nav, loop } = this.props
//         const { current } = this.state

//         if(this.tnsCon){
//             this.tns = tns({
//                 container: this.tnsCon,
//                 // "autoWidth": true,
//                 controls,
//                 nav,
//                 loop,
//                 rewind:loop,
//                 index: (+current)||0,
//                 "items": 1,
//                 "gutter": 0,
//                 "mouseDrag": true,
//                 "swipeAngle": false,
//                 "speed": 400,
//                 // mode:'gallery'
//               });

//             this.tns.events.on('indexChanged', (e,b)=>{
//                 if(this.state.current != e.index){
//                     this.setState({current: e.index})
//                     this.ee.fire('change', {index:e.index})
//                 }
//             })
//         }
//     }

// const TinySliderF = p=>{

// }

export default TinySlider