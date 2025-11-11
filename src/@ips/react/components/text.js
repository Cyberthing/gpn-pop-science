import React, { forwardRef, useState, useEffect } from 'react'
import { useMemo, useCallback } from 'use-memo-one'

import cx from '@ips/app/classnamex'
import carryUnions from '@ips/typo/carry-unions'
import noYo from '@ips/typo/noyo'
import { filterReadableEsc } from '@ips/typo/filter-readable'
import {shyify} from '@ips/typo/shyify'
// import { createTextStyle, removeTextStyle } from '@ips/app/font-utils'
// import { genClassName, createStyle } from '@ips/app/css-utils'

import { useTextStyle } from '@ips/react/components/utils/use-text-style'
import { useGridStyle, usePaddingStyle, layoutStyleCustom } from '@ips/react/components/layout'

import { genClassName, createStyle, useStyle } from '@ips/react/components/utils/use-style'

const calcClassName = (p)=>`${p.classPrefx||''}text ${p.className||''} ${(p.mod||'').split(' ').map(s => `${p.classPrefx||''}text_${s}`).join(' ')}`

// const widthStyle = v=>(v&&!classyVal(v))?`width:${v};`:''
const widthStyle = v=>v?`width:${v};`:''
const noSelectStyle = v=>v?`user-select:none;`:''

const textClassName = genClassName('texo')
const css = `
.${textClassName} p { margin:0 }
.${textClassName} p + p { margin-top: 1em; }
.${textClassName} + .${textClassName} { margin-top: 1em; }
`

const sstyle = createStyle('texo')
sstyle.addRaw(css)

export const Text = forwardRef((p, ref)=>{

    const { onClick, onMouseOver, onMouseOut, } = p
    const events = { onClick, onMouseOver, onMouseOut, }

    const [textStyleClass] = useTextStyle(p.textStyle)

    const gridStyle = useGridStyle()
    const gutterClass = gridStyle.gutterClass()
    const [paddingClass] = usePaddingStyle(p.padding)

    const customStyle = useMemo(()=>(widthStyle(p.width)+noSelectStyle(p.noSelect)), Object.values(p))
    const [uClassName] = useStyle(layoutStyleCustom, customStyle)

    const text = p.text||''
    const html = useMemo(()=>{
        if(p.raw)
            return text
        let t = filterReadableEsc(''+text||'')
        t = carryUnions(t)
        if(!p.yo)
            t = noYo(t)
        if(p.shyify)
            t = shyify(t)
        return t
    }, [text, p.raw])
    const className = useMemo(()=>cx(calcClassName(p), !p.noParagraph&&textClassName, uClassName, textStyleClass, !(p.noGutter)&&gutterClass, paddingClass), [p.classPrefx, textClassName, p.className, p.mod, textStyleClass, gutterClass, paddingClass])

    return <div ref={ref} className={className} style={p.style} {...events} dangerouslySetInnerHTML={{ __html: html }}/>
})
Text.displayName = 'Text'

export default Text
