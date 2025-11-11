import React, { forwardRef } from 'react'
import { useExprContext } from '@ips/react/components/utils/react-expr'

export const UnsafeHtml = forwardRef((p, ref)=>{
    const {content='', component='div', ...otherProps} = p

    const [ useExpr ] = useExprContext() // create a new Expr Context and get a custom useExpr hook from it
    const className = useExpr('className', p.className)

    const C = component
    
    return (<C
        ref={ref}
        dangerouslySetInnerHTML={{__html:content}}
        {...otherProps}
        className={className}
    />)
})

UnsafeHtml.displayName = 'UnsafeHtml'

export default UnsafeHtml