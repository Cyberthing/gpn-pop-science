import React from 'react'
import Base from 'components/base'

export class Optional extends Base{

    evalCondition(cond, override){
        trace('optional eval condition', cond, eval(cond))
        if( typeof override !== 'undefined' )
            return override;
        return eval(cond);
    }

    render(){
        const { className, condition, override, children } = this.props
        //"optional"
        //<div class="{ classname }">

        if(!this.evalCondition(condition, override))
            return null

        return <React.Fragment>{ children }</React.Fragment>
    }
}

// props:[
//     "cond",
//     "override"
// ],

export default Optional