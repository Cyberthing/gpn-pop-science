import React, { forwardRef } from 'react'
import Base from './base'
import './fixed.styl'

const ud = v => 'undefined' == typeof(v)

// export class Fixed extends Base{
//     render(){
//         const { style, children, cover, h100, w100, left, top, } = this.props
// 
//         const p = this.props
//         const s = this.state
// 
//         const sstyle = style||{}
//         if(!ud(left))
//             sstyle.left = left
//         if(!ud(top))
//             sstyle.top = top
// 
//         // trace('fixed', this)
// 
//         return  <div className={ `fixed ${ !ud(s.className) ? s.className : (p.className||'') } ${ cover ? 'fixed_cover': '' } ${ w100 ? 'fixed_w100': '' } ${ h100 ? 'fixed_h100': '' } ` } style={ sstyle }>
//                     { children }
//                 </div>
//     }
// }
export const Fixed = forwardRef(({ style, children, className, cover, h100, w100, left, top, ...p}, ref)=>{

    const sstyle = style||{}
    if(!ud(left))
        sstyle.left = left
    if(!ud(top))
        sstyle.top = top

    return  <div ref={ref} className={ `fixed ${ className||'' } ${ cover ? 'fixed_cover': '' } ${ w100 ? 'fixed_w100': '' } ${ h100 ? 'fixed_h100': '' } ` } style={ sstyle } {...p}>
                { children }
            </div>
}, 'Fixed')

export default Fixed