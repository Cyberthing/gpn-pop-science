import React, { forwardRef } from 'react'
import './wrapper.styl'
// import { ActivationContext } from './activation'

export const Wrapper = forwardRef((props, ref) => <div ref={ref} className={ `wrapper ${ props.className||'' }` }>
        <div className="wrapper__container">
            { props.children }
        </div> 
    </div>)
Wrapper.displayName = 'Wrapper'

export default Wrapper


// export default (props) => 
//     (<ActivationContext.Consumer>
//         { context => <div className={ `wrapper ${ props.className||'' }` }>
//                         <div className="wrapper__container">
//                             <ActivationContext.Provider value={ context }>
//                                 { props.children }
//                             </ActivationContext.Provider>
//                         </div> 
//                     </div> }
//     </ActivationContext.Consumer>)
