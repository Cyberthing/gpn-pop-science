import React from 'react'
import Base from './base'
import { register, request } from '@ips/app/app-registry'
import { execute } from '@ips/app/actions'
import { trackPoint } from './utils/vistracker'
//trace('imported trackit', trackit)
import _ from 'lodash'

export class Vispoint extends Base{

    constructor(props){
        super(props)

        this.cbs = {}
    }

    async created(){
        super.created()

        const { way } = this.props
        const { action } = this.cprops

        this.trackerInstance = trackPoint(this.$el, { mode: 'toggle' }, ()=>{ 
            // this.setState({ visible:true }); 
            trace('vispoint event')
            this.fire('visible', { target: this })
            action()
        })
    }

    destroyed(){
        if(this.trackerInstance){
            this.trackerInstance.destroy()
            this.trackerInstance = null
        }
    }
    
    fire(evt, opts){
        if(this.cbs[evt])
            _.each(this.cbs[evt], cb=>cb(opts))
    }

    on(evt, cb){
        this.cbs[evt] = this.cbs[evt]||[]
        this.cbs[evt].push(cb)
    }
    
    recalc(props, state){
        const { className, action } = props
        // const { visible } = state

        return {
            className: `vispoint ${ className||'' }`,
            action: action ? ()=>execute(action) : ()=>{}
        }
    }

    render(){
        const { className } = this.cprops
        return  <div ref={ ref => this.$el = ref }  className={ className }/>
    }
}

export default Vispoint