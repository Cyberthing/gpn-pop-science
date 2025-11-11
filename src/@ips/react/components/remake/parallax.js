import React from 'react'
import Base from './base'

import './parallax.styl'

export class Parallax extends Base{
    render(){
        const { className,  children } = this.props
        return <div ref={ ref=> this.$el = ref } className={`parallax ${ className||'' }`}> 
                    { children } 
                </div>
    }
}

export default Parallax