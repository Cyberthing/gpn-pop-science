import React from 'react';
import Base from './base'
import { register, request } from '@ips/app/app-registry'
import { execute } from '@ips/app/actions'
import cx from '@ips/app/classnamex'

export class Waypoint extends Base{

    async created(){
        super.created()

        const { way, edge, top, spread, name } = this.props

        if(way){
            const res = await request([way]);
            // trace('waypoint got the way', res[way], this.props.className||'')
            this.way = res[way]
            res[way].add(this.$el, edge, top, spread, name)
        }
    }

    destroyed(){
        super.destroyed()
        
        if(this.way)
            this.way.remove(this.$el)
    }

    recalc(props, state){
        const { className } = props

        return {
            className: cx('waypoint', className&&className),
        }
    }

    render(){
        const { way, name } = this.props
        const { className } = this.cprops
        return  <div ref={ ref => this.$el = ref } data-way={ way||'default' } data-name={ name } className={ className }/>
    }
}

export default Waypoint