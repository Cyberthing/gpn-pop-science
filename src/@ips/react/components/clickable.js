import React from 'react'
import Base from './base'
import { register } from '@ips/app/app-registry'
import EventEmitter from '@ips/app/event-emitter'

import './clickable.styl'

export class Clickable extends Base{

    render(){
        const { style, children } = this.props
        const p = this.props
        const s = this.state
        return <div className={ `clickable ${ s.className || p.className || '' }` } style={ style } onClick={ ()=> this.ee.fire('click') }>
            { children }
        </div>
    }
}

export default Clickable