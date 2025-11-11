import React from 'react'
import Base from './base'

export class DisplayText extends Base{

    // recalc(props, state, force){
    //     let cprops = super.recalc(props, state, force)
    // }

    created(){
        trace('dtext created')
        const { text } = this.props;
        this.setState({ text })
        this.renderExpr('text', text, v=>this.setState({ text:v }))
    }

    render(){
        const { className, style } = this.props
        const { text } = this.state

        const p = this.props
        const s = this.state

        return  <div className={ `display-text ${ s.className||p.className||'' }` } style={ style }>
                    { text }
                </div>
    }
}

export default DisplayText