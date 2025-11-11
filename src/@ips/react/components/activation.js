import React, { useContext } from 'react'

// const ctxState = {
//     mediaLoader:()=>{},
//     inactive:false,
// }

// <Preload>
// </Preload>

// <Activation active={ }>
//  { page }
//            <Slice>
//                <Img src="teh.jpg"/>
//            </Slice>
// </Activation>

export const ActivationContext = React.createContext({ active:true })
export const Activation = props =>
    (<ActivationContext.Provider value={props}>
        { props.children }
    </ActivationContext.Provider>)

export const ActivationSingle = React.forwardRef((props, ref) =>
    (<ActivationContext.Provider value={props}>
        { React.cloneElement(React.Children.only(props.children), { ref }) }
    </ActivationContext.Provider>))

export const useActivation = ()=>{
    const ctx = useContext(ActivationContext)
    return ctx.active
}

export const withActivation = (active, c) =>
    (<ActivationContext.Provider value={{active}}>
        { c }
    </ActivationContext.Provider>)
