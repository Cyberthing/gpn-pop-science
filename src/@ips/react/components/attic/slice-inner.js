import React, { Component } from 'react'
import { register } from '@ips/app/app-registry'
import './slice.styl'

export class SliceInner extends Component{
    constructor(){
        super()
        this.state = {}
    }

    componentDidMount(){
        const { name, width, height, align, className } = this.props;

        if(name)
            register(name, this)

        const containerClassname = `slice__sec ${className||''} ${ 'width' + (width||12) } ${ align ? 'align-' + align : 'align-center' }${ height ? ' table':'' }`

        const style = {}
        if(height)
            style.height = height

        this.setState({ containerClassname, style })
    }

    render(){
        const p = this.props;
        const s = this.state;

        return <div className={ s.containerClassname||'' } style={ s.style }>
                { p.children }
            </div>
    }
}

export default SliceInner