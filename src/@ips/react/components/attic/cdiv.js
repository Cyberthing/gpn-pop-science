import React, { Component } from 'react'
import Base from './base'

export class Cdiv extends Base{
    render(){
        const p = this.props
        const s = this.state
        return <div ref={ ref=> this.$el = ref }className={ s.className || p.className || '' } style={ p.style||{} }>
            { p.children }
        </div>
    }
}

export default Cdiv