import React from 'react'
import Base from './base'

import './parallax-scene.styl'

export class ParallaxScene extends Base{
    render(){
        const { className, children } = this.props
        return <div className={`parallax-scene ${ className || '' }`}> 
                    { children } 
                </div>
    }
}

export default ParallaxScene