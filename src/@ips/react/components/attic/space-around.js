import React, { Component } from 'react'
import "./space-around.css"

import { register, unregister } from "@ips/app/app-registry"

export class SpaceAround extends Component{
    componentDidMount(){
        if(this.props.name)
            register(this.props.name, this)
    }

    componentWillUnmount(){
        if(this.props.name)
            unregister(this.props.name, this)
    }

    render(){
        return  <div className={ `space-around ${ this.props.className || '' }` }>
                    { this.props.children }
                </div>
    }
}

export default SpaceAround