import React, { forwardRef } from 'react'
import { createStyle } from '@ips/app/css-utils'
import { ToggleClassName } from './ref-apply'

const op0style = createStyle()
op0style.addRaw(`
    .opacity_0{
        opacity: 0;
    }
`)
export const Opacity0 = forwardRef((p, ref)=><ToggleClassName className="opacity_0" {...p}/>)
Opacity0.displayName = 'Opacity0'
