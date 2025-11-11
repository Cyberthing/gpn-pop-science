import React, { useState, useEffect } from 'react'
import { useCallback, useMemo } from 'use-memo-one'
import { isExpr, compileExpr, Context } from './expr'
import * as __ from "@ips/app/hidash"

// export const renderExprF = (name, val, post)=>{
//     if(!isExpr(val))
//         return

//     const [ctx, setCtx] = useState(new Context())

//     const [expr, setExpr] = useState(null)
//     if(expr)
//         return

//     const e = compileExpr(val, ctx)

//     // this.setState({ [prop]: post(v) }) ) // set named prop with []

//     const e0 = __.isArray(e) ? e[0] : e
//     e0.listen(post)

//     if(!__.ud(e0.v)){
//         post(e0.v)
//     }else{
//         // apply default if e0 has not yet been calculated
//         const e1 = __.isArray(e) ? e[1] : null
//         if(e1)
//             post(e1.v)
//     }

//     setExpr(e)
// }


// // TODO: rewrite it to add the prop to the expr context
// export const useExpr = p =>{
//     const [ctx, setCtx] = useState(new Context())
//     const [expr, setExpr] = useState(null)
//     const [val, setVal] = useState(null)
//     // trace('useExpr', p)

//     // const narVal = useCallback(()=>{ setVal(val); ctx.updateProp() }, [])

//     useEffect(()=>{

//         if(!isExpr(p)){
//             setVal(p)
//             return
//         }
//         // trace('useExpr recompile', p)

//         const e = compileExpr(p, ctx)
//         const e0 = __.isArray(e) ? e[0] : e
//         e0.listen(setVal)

//         if(!__.ud(e0.v)){
//             setVal(e0.v)
//         }else{
//             // apply default if e0 has not yet been calculated
//             const e1 = __.isArray(e) ? e[1] : null
//             if(e1)
//                 setVal(e1.v)
//         }

//         return __.isArray(e) ? ()=>e.forEach(ee=>ee.destroy()) : ()=>e.destroy()

//     }, [p])

//     return val
// }


export const useExprContext = ()=>{
    const [ctx, setCtx] = useState(new Context())

    const useExpr = useCallback((prop, val, post = __.ident)=>{
        // const [expr, setExpr] = useState(null)
        const [v, setV] = useState(val)
        const narVal = useCallback(v=>{ setV(post(v)); ctx.updateProp(prop, v) }, [])

        useEffect(()=>{

            if(!isExpr(val)){
                narVal(val)
                return
            }
            // trace('useExpr recompile', val)

            const e = compileExpr(val, ctx)
            // setExpr(e)
            const e0 = __.isArray(e) ? e[0] : e
            e0.listen(narVal)

            if(!__.ud(e0.v)){
                narVal(e0.v)
            }else{
                // apply default if e0 has not yet been calculated
                const e1 = __.isArray(e) ? e[1] : null
                if(e1)
                    narVal(e1.v)
            }

            return __.isArray(e) ? ()=>e.forEach(ee=>ee.destroy()) : ()=>e.destroy()

        }, [prop, val])

        return v

    }, [])

    // end of life
    useEffect(()=>{
        return ()=>{} //TODO: destroy context
    }, [])

    return useMemo(()=>([
        useExpr,
        ctx,
    ]), [])
}

// withExpr(C, {
//     holyMoly:'expr asfsdfw, 0',
//     dollyLolly:'expr asfsdfw, 0',
// })

export const withExpr = (C, e)=>{
    const [useExpr] = useExprContext()
    const c = {}

    //......... useExprContext()

    return <C {...c}/>
}


// <Expr className='expr asfsdfw, 0' dataUid='expr asfsdfw, 0'>
//      <div>adasdd</div>
// </Expr>

export const Expr = (R, e)=>{
    const [useExpr] = useExprContext()
    const c = {}
    
    const onlyChild = React.Children.only(children)
    return useMemo(()=>React.cloneElement(onlyChild, { ref, ...pp }), [onlyChild])
}
