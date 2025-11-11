import React from 'react'
import Base from 'components/base'
import './screen-height.styl'

export class ScreenHeight extends Base{
    recalc(){
        const { className } = this.props

        return {
            className: `screen-height ${ className||'' }`
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

export default ScreenHeight