import React, { Component } from 'react'
import "./space-between.css"

import { register, unregister } from "@ips/app/app-registry"

export class SpaceBetween extends Component{
    componentDidMount(){
        if(this.props.name)
            register(this.props.name, this)
    }

    componentWillUnmount(){
        if(this.props.name)
            unregister(this.props.name, this)
    }

    render(){
        return  <div className={ `space-between ${ this.props.className || '' }` }>
                    { this.props.children }
                </div>
    }
}

export default SpaceBetween