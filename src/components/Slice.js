import React,  { forwardRef } from 'react';
import { Column, Slice as LayoutSlice } from '@ips/react/components/layout';
import cx from '@ips/app/classnamex'

export const Slice = forwardRef(({className, backPlate, ...p}, ref)=>(
    <LayoutSlice
        ref={ref}
        className={cx('slice_v2', className)}
        {...p}
    />))
Slice.displayName = 'Slice'

export const LeftSlot = (p)=><Column width="6" {...p}/>
export const RightSlot = (p)=><Column width="6" {...p}/>

Slice.LeftSlot = LeftSlot
Slice.RightSlot = RightSlot

export default Slice