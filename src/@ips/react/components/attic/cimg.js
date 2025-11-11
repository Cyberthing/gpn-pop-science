import React, { Component } from 'react'
import Base from './base'
import { requestUrl } from '@ips/app/resource'

export class Cimg extends Component{
    render(){
        const p = this.props
        return <img className={ p.className || '' } style={ p.style } src={ requestUrl(p.src, 'image') }/>
    }
}

export default Cimg