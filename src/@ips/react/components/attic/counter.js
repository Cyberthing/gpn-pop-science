import React from 'react';
import Base from './base';
import PropTypes from 'prop-types';
// import './counter.styl'

// import TW from './utils/raf-tween'
import { tween, Easing, parseParams } from './utils/raf-tween'
import EventPipe from '@ips/app/event-pipe'

import { isExpr, compileExpr } from './utils/expr'

// import { TweenLite } from "gsap/TweenLite";
// import { Circ } from "gsap/EasePack";
// import { register } from 'app/app-registry'


export class Counter extends Base{

    state = { current:0 }

    recalc(props, state, force){
        let cprops = super.recalc(props, state, force)

        const { current, target, time } = state;

        if( target != current && (target != this.state.target || force) ){
            trace('recalc target', target)

            if(this._tween)
                this._tween.stop()
            
            // trace('target changed', current.target, this);

            this._tween = tween(
                {
                    from: current,
                    to: target,
                    time,
                    easing: Easing.Circular.Out,  
                    // update:(current, pos) => { trace('zazoo', current , pos); this.setState({ current: Math.ceil(current) })},
                    update:(current, pos) => this.setState({ current: Math.ceil(current) }),
                    //stop:(cur, tgt, pos) => cur.current == tgt.current,
                    end:()=> this._tween = null,
                })
        }
        return cprops
    }

    created(){
        super.created()

        trace('counter', this)

        const { current, target, time, formatter } = this.props

        this.renderExpr('current', current, v=>this.setState({ current: v|0 }))
        this.renderExpr('target', target, v=>this.setState({ target: v|0 }))

        this.setState({
            current,
            target,
            time,
            formatter
        })
    }

    render(){
        const { style, className } = this.props
        const { current, formatter } = this.state

        const p = this.props
        const s = this.state

        return <span style={ style } className={ `counter ${ s.className||p.className||'' }` }>{ formatter  ? formatter(current) : current }</span>
    }
}

Counter.propTypes = {
    name: PropTypes.string,
    style: PropTypes.object,
    className: PropTypes.string,
    time: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    current: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    target: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    formatter: PropTypes.func
}

Counter.defaultProps = {
    name: null,
    addStyle: {},
    className: null,
    time: 1,
    current: 0,
    target: 0,
    // formatter:
}

export default Counter