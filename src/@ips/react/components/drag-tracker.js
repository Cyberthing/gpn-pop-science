import React from 'react'
import Base from './base'
import { register } from '@ips/app/app-registry'
import { windowSize } from '@ips/app/dom-utils'
import { track } from './utils/drag-tracker'
import EventEmitter from '@ips/app/event-emitter'
import { parseParams } from '@ips/app/parse-params'

import './drag-tracker.styl'

export class DragTracker extends Base{

    created(){
        super.created()
        const { integer, range, loop, mode, speedMultiplier } = this.props
        const {  } = this.cprops

        const crange = range ? parseParams(range) : null;

        this.trackerInstance = track(this.$el, e=>{ this.ee.fire('drag', e) }, { 
            integer, 
            range:crange, 
            loop, 
            mode,
            speedMultiplier })

        trace('DragTracker', this)
    }

    destroyed(){
        if(this.trackerInstance){
            this.trackerInstance.destroy()
            this.trackerInstance = null
        }
        super.destroyed()
    }

    render(){
        const { children } = this.props

        const p = this.props
        const s = this.state

        return  <div ref={ ref => this.$el = ref } className={ 'drag-tracker ' + (s.className || p.className || '') }>
                    { children }
                </div>
    }
}

export default DragTracker