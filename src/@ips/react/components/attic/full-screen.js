import React from 'react'
import Base from 'components/base'
import { register, unregister } from "@ips/app/app-registry"
import { requestUrl } from '@ips/app/resource'
import './full-screen.styl'

export class FullScreen extends Base{
    recalc(){
        const { className } = this.props

        return {
            className: `full-screen ${ className||'' }`
        }
    }

    render(){
        const { children, style } = this.props
        const { className } = this.cprops

        return  <div className={ className } style={ style }>
                    { children }
                </div>
    }
}

export default FullScreen