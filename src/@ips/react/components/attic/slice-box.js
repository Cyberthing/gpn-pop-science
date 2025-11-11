import React, { Component } from 'react'
import PropTypes from 'prop-types';
import { register, unregister } from '@ips/app/app-registry'
import './slice.styl'

export class SliceBox extends Component{
    constructor(props){
        super(props)
        this.cprops = this.recalc(props, this.state)
    }

    componentWillUpdate(props, state){  // NOTE: recalc() should be here
        this.cprops = this.recalc(props, state)
    }

    componentDidMount(){
        const { name } = this.props

        if(name)
            register(name, this)
    }

    componentWillUnmount(){
        const { name } = this.props

        if(name)
            unregister(name, this)
    }

    recalc(props, state){
        const { className } = props;

        return {
            className: `slice ${ className||'' }`,
        }
    }

    render(){
        const { style, children } = this.props
        const { className } = this.cprops

        return  <div className={ className } style={ style }>
                    { children }
                </div>
    }
}

SliceBox.propTypes = {
    style: PropTypes.object,
    className: PropTypes.string,
}

SliceBox.defaultProps = {
    style: {},
    className: null,
}

export default SliceBox