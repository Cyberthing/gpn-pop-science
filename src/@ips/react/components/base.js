import React, { Component } from 'react'
import { register, unregister } from '@ips/app/app-registry'
import EventEmitter from '@ips/app/event-emitter'

import { Context, isExpr, compileExpr } from './utils/expr'
import { isArray } from '@ips/app/hidash'

//<EventPipe in="way updated position" out="back-gal set curSlide"/>

const ud = v => 'undefined' == typeof v

export class Base extends Component{
    ee = new EventEmitter(this)
    state = {}

    constructor(props){
        super(props)
        this.cprops = this.recalc(props, this.state, true)
    }

    // componentWillUpdate(props, state, ctx){
    //     this.cprops = this.recalc(props, state, false, ctx)
    // }

    componentDidMount(){
        this._isMounted = true
        this.created()
        this.ee.fire('created')
    }

    UNSAFE_componentWillUpdate(props, state, ctx){
        this.willUpdate(props, state, ctx)
    }

    componentDidUpdate(prevProps, prevState, prevCtx){
        this.updated(prevProps, prevState, prevCtx)
    }

    componentWillUnmount(){
        this.destroyed()
        this.ee.fire('destroyed')
        this._isMounted = false
    }

    created(){
        const { name, className } = this.props
        const {  } = this.cprops

        if(name)
            register(name, this)

        this.renderExpr('className', className, v => this.setState({ className: v }))
    }

    willUpdate(){
    }

    updated(){
    }

    renderExpr(prop, value, post = v=>v){
        if(ud(value))
            return

        if(!isExpr(value)){
            post(value)
            return
        }

        // trace('renderExpr', prop, value)

        this._exprs = this._exprs||{}

        if(!this.state.hasOwnProperty(prop)){
            this.state[prop] = undefined
        }
        this._exprContext = this._exprContext || new Context(this.state)

        const e = compileExpr(value, this._exprContext)
        this._exprs[prop] = e
        // trace('jsepped', e.v)

        const e0 = _.isArray(e) ? e[0] : e
        e0.listen(post) 
                            // this.setState({ [prop]: post(v) }) ) // set named prop with []
        if(!ud(e0.v)){
            post(e0.v)
        }else{
            // apply default if e0 has not yet been calculated
            const e1 = _.isArray(e) ? e[1] : null
            if(e1)
                post(e1.v)
        }
    }

    destroyed(){
        const { name } = this.props        
        if(name)
            unregister(name, this)
    }

    recalc(props, state, force){
        // trace('Base recalc', props)

        if(this._exprContext)
            this._exprContext.update(state)

        return this.cprops||{}
    }
}

export default Base