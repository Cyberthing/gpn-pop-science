import React from 'react'
import Base from './base'

// import './parallax.styl'

import ReactRellax from 'react-rellax'

// export default ReactRellax

export const Rellax = props=>{
    // props.speed = +props.speed
    return <ReactRellax { ...props } speed={ +props.speed }/>
}

// export default class Rellax extends Base{
//     render(){
//         const { className,  children } = this.props
//         return <div ref={ ref=> this.$el = ref } className={`parallax ${ className||'' }`}> 
//                     { children } 
//                 </div>
//     }
// }

export default Rellax