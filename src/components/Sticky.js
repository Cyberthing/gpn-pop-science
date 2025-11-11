import React, { forwardRef } from 'react'
import cx from '@ips/app/classnamex'

export const Sticky = forwardRef(({ className, ...p }, ref)=><div ref={ref} className={cx('scroll-fixed', className)} {...p}/>)

export default Sticky