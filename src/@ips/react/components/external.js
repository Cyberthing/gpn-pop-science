import React, { Component } from 'react'
import Base from './base'

import { request } from '@ips/app/app-registry'

export class External extends Base{
    request = async c => {
        const res = await request([c])
        const Compo = res[c]
        this.setState({ Compo })
    }

    created(){
        const { tag } = this.props
        this.request(tag)
    }

    updated(prevProps){
        const { tag } = this.props
        if(prevProps.tag != tag)
            this.request(tag)
    }

    render(){
        // trace('External.render', this.props, this.state)
        const { Compo } = this.state
        if(Compo)
            return <Compo { ...this.props }/>

        return null
    }
}

export default External