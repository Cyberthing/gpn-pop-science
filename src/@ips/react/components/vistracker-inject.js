import React, { Component } from 'react'
import { register } from '@ips/app/app-registry'
import { windowSize } from '@ips/app/dom-utils'
import { trackBox } from './utils/vistracker'
//trace('imported trackBox', trackBox)

import EventEmitter from '@ips/app/event-emitter'

import './vistracker.styl'

import { execute } from '@ips/app/actions'
//trace('execute', execute)


export class VistrackerInject extends Component{
    ee = new EventEmitter()

    constructor(props){
        super(props)
        this.state = { visible:false }
        this.cprops = this.recalc(props, this.state)
        this.cbs = {}
    }

    componentWillUpdate(props, state){
        // trace(this.state.visible)
        this.cprops = this.recalc(props, state)
    }

    async componentDidMount(){
        this.created()
    }

    async componentWillUnmount(){
        this.destroyed()
    }

    created(){
        const { name, trigger, top, bottom } = this.props
        const { action } = this.cprops

        if(name)
            register(name, this)

        const pstyle = window.getComputedStyle(this.$el.parentElement)
        // trace('pstyle.position', pstyle.position)
        // if(pstyle.position != 'relative' && pstyle.position != 'fixed' && pstyle.position != 'absolute')
        if(pstyle.position == 'static')
            this.$el.parentElement.style.position = 'relative'

        const ws = windowSize()

        this.$el.style.padding = `${ (top||0)/100 * ws.y }px 0px ${ (bottom||0)/100 * ws.y }px 0px`
        this.trackerInstance = trackBox(this.$core, visible =>{ 
            this.setState({ visible })
            if(visible){
                this.ee.fire('visible', { visible: true })
                action()
            }
            else{
                this.ee.fire('visible', { visible: false })
                this.ee.fire('invisible')
            }
        })

        // window.addEventListener('resize', _.throttle(()=>{
        //     if(this.trackerInstance){
        //         this.trackerInstance.destroy()
        //         this.trackerInstance = null
        //     }

        //     this.created()

        // }, 500))
    }

    destroyed(){
        if(this.trackerInstance){
            this.trackerInstance.destroy()
            this.trackerInstance = null
        }
    }
    
    // fire(evt, opts){
    //     if(this.cbs[evt])
    //         _.each(this.cbs[evt], cb=>cb(evt, opts))
    // }

    // on(evt, cb){
    //     this.cbs[evt] = this.cbs[evt]||[]
    //     this.cbs[evt].push(cb)
    // }
    
    recalc(props, state){
        const { className, action } = props
        const { visible } = state

        return {
            className: `vistracker-inject ${ visible ? 'visible' : '' } ${ className||'' }`,
            action: action ? ()=>execute(action) : ()=>{}
        }
    }

    render(){
        const { className } = this.cprops

        return  <div ref={ ref => this.$el = ref } className={ className }>
                    <div className="vistracker--wrap">
                        <div ref={ ref => this.$core = ref }  className="vistracker--core"/>
                    </div>
                </div>
    }
}

//<svelte:window on:resize="onResize()"/>


//       props:['name', 'top', 'bottom'],

export default VistrackerInject