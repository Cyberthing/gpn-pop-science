import React,  { forwardRef } from 'react';
import { Column, Slice as LayoutSlice } from '@ips/react/components/layout';
import cx from '@ips/app/classnamex'

export const Slice = forwardRef(({className, backPlate, ...p}, ref)=>(
    <LayoutSlice
        ref={ref}
        width="9"
        className={cx('slice_v2', className)}
        {...p}
    />))
Slice.displayName = 'Slice'

export const LeftSlot = forwardRef((p, ref)=><Column ref={ref} width="4" {...p}/>)
export const RightSlot = forwardRef((p, ref)=><Column ref={ref} width="5" {...p}/>)

Slice.LeftSlot = LeftSlot
Slice.RightSlot = RightSlot

export default Slice