import React, { Component } from 'react'
import { register, unregister } from "@ips/app/app-registry"

export class Spacer extends Component{

    constructor(props){
        super(props)
        this.state = {}
        this.cprops = this.recalc(props, this.state)
    }

    componentWillUpdate(props, state){
        this.cprops = this.recalc(props, state)
    }

    componentDidUpdate(){
    }

    componentDidMount(){
        if(this.props.name)
            register(this.props.name, this)
    }

    componentWillUnmount(){
        if(this.props.name)
            unregister(this.props.name, this)
    }

    render(){
        const { className, style } = this.cprops

        return <div className={ className } style={ style }/>
    }

    recalc(props, state){
        const { className, height } = props

        return {
            className: `spacer ${ className||'' }`,
            style: { height: height, width:'100%' },
        }
    }


}

export default Spacer