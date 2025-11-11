import React, { forwardRef } from 'react'
// import Base from './base'

import { useExprContext } from './utils/react-expr'
// import { useEventEmitter } from './utils/react-app-registry'

// import './jogwheel.styl'

import JW from './lib/react-jogwheel';

// load Web Animations polyfill for IE (https://github.com/web-animations/web-animations-js)
// import './lib/web-animations/web-animations.min.js';

// class Jogwheel extends Base{
//     // state = {
//     //   progress:0  // this is indeed needed in order to be able to use it in expr context (e.g. for tweening)
//     // }

//     created(){
//         const { progress } = this.props
//         this.renderExpr('progress', progress, progress=>this.setState({ progress }))
//         // this.setState({ progress: 0})
//         // trace('jogwheel', this)
//     }

//     willUpdate(props, state, ctx){
//         // updating expr context
//         this.cprops = this.recalc(props, state, false, ctx)        
//     }

//     // updated(){
//     //     // trace('JW updated')
//     // }

//                     // TODO
//                   // name='jwn'
//                   // playstate='paused'
//                   // playing={ false } 
//     render(){
//         trace('JW render', this.props, this.state.progress)
//         return <JW ref={ ref=>this.instance = ref }
//                   {...this.props}
//                   progress={this.state.progress}
//                 />
//     }
// }

export const Jogwheel = forwardRef((p, ref)=>{
  // const ee = useEventEmitter(p.name)
  const [ useExpr ] = useExprContext()
  const progress = useExpr('progress', p.progress)

//                     // TODO
//                   // name='jwn'
//                   // playstate='paused'
//                   // playing={ false } 

  // trace('updachtung', progress, p.component)

  return <JW {...p} progress={progress||0}/>
})

export default Jogwheel