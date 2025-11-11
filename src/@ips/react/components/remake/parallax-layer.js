import React from 'react'
import Base from './base'

import './parallax-layer.styl'

export class ParallaxLayer extends Base{
    render(){
        const { children, depth, y, scale, className } = this.props

        // orthographic back scale orthos = 1 + (translateZ * -1) / perspective. 
        // taken from here: https://keithclark.co.uk/articles/pure-css-parallax-websites/
        const orthos = 1 + (depth * -1) / 300

        return <div className={`parallax-layer ${ className||'' }`} style={{ transform:`translate3d(0, ${ y || 0 }%, ${ depth||0 }px) scale(${ orthos * (scale||1) }` }}> 
                    { children } 
                </div>
    }
}

export default ParallaxLayer