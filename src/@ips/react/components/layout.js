import React, { Component, useRef, useState, useEffect, useLayoutEffect, useContext, forwardRef, createContext } from 'react'
import { useMemo, useCallback } from 'use-memo-one'
import { parseMeasures } from '@ips/app/parse-measures'

import './layout.styl'

import { useSizerSize } from '@ips/react/components/utils/use-sizer'
import { createStyle, useStyle } from '@ips/react/components/utils/use-style'
import { useScene } from '@ips/react/components/utils/use-scene'
import { useResizeObserver } from '@ips/react/components/utils/use-resize-observer'
import { nop } from '@ips/app/hidash'
import cx from '@ips/app/classnamex'

import uniqueNumber from '@ips/app/unique-number'

const calcPaddingStyle = p=>{
    if(!p) return ''
    return `padding: ${p};`//.split(' ').map(v=>(v||0)+'px').join(' ')};`
}

const paddingStylesheet = createStyle('padding')

export const usePaddingStyle = p=>{
    const pstyle = useMemo(()=>calcPaddingStyle(p), [p])
    // trace('pstyle', pstyle)
    return useStyle(paddingStylesheet, pstyle)
}

export const createGridStyleContext = (p = {})=>{
    const { props, parent, onUpdate = nop } = p
    // trace('createGridStyleContext', props)

    const gridStyleSheet = createStyle('grid')

    let _useCount = 1
    const _props = props||{
        gutter:16,
        maxWidth:1440,
        columns:12,
    }

    const gutterClass = 'g' + uniqueNumber();
    const gutterCSS = ()=>`padding-left:${_props.gutter}px;padding-right:${_props.gutter}px;`
    const gutterRule = gridStyleSheet.addRule('.'+gutterClass, gutterCSS())


    const setGutter = (g=16)=>{
        _props.gutter = g
        gridStyleSheet.modifyRule(gutterRule, gutterCSS())
    }

    const setMaxWidth = (w=1440)=>{
        _props.maxWidth = w
    }

    const setColumns = (c=12)=>{
        _props.columns = c
    }

    return {
        // gutterClass:()=>gutterClass,
        gutterClass:()=>'grid-gutter',
        gutter:()=>_props.gutter,
        maxWidth:()=>_props.maxWidth,
        columns:()=>_props.columns,
        gridSizeName:()=>'large',
        discreteAdaptive:()=>false,
        update:p=>{
            // trace('GridStyleContext.update', p)
            setGutter(p.gutter)
            setMaxWidth(p.maxWidth)
            setColumns(p.columns)
            onUpdate(_props)
        },
        acquire:()=>{
            _useCount++
        },
        release:()=>{
            _useCount--
            if(_useCount <= 0)
                gridStyleSheet.destroy()
        },
        _props,
    }
}

export const GridStyleContext = createContext(createGridStyleContext())
export const useGridStyle = ()=>useContext(GridStyleContext)

// const setCssVars = (width, maxWidth, gutter, columns, applyTo)=>{
//     // const width = getSize().x - (Modernizr['platform-windows'] ? 17:0)
//     const rvw = Math.min(width, maxWidth) * 0.01;
//     applyTo.style.setProperty('--rvw', `${rvw}px`);
//     applyTo.style.setProperty('--grid-max-width', `${maxWidth}px`);
//     applyTo.style.setProperty('--grid-columns', `${columns}`);
//     applyTo.style.setProperty('--grid-gutter', `${gutter}px`);
//     applyTo.style.setProperty('--grid-bs', `${maxWidth/columns}px`);
// }

const setCssVars = (vars, applyTo)=>{
    // trace('setCssVars', vars, applyTo)
    if(!applyTo)
        return
    Object.keys(vars).forEach(k=>{
        // trace('applying', k, applyTo)
        applyTo.style.setProperty('--'+k, vars[k]);
    })
}

export const GridStyle = p=>{
    const { maxWidth=1440, gutter=16, columns=12, padding=0, gutterMobile, maxWidthMobile } = p
    const ref = useRef()
    const gridStyle = useGridStyle()
    // trace('got gridStyle', gridStyle)
    const [ssize] = useSizerSize()
    const mobile = ssize===0

    const scene = useScene()
    // trace('GridStyle', mobile, ssize)

    const gs = useMemo(()=>{
        const gs = ({
            gutter:(scene.mobile&&gutterMobile)?gutterMobile:gutter,
            maxWidth:(scene.mobile&&maxWidthMobile)?maxWidthMobile:maxWidth,
            columns,
            padding,
        })
        // trace('updating gridStyle', gs)
        gridStyle.update(gs)
        return gs
    }, [scene.mobile, maxWidth, gutter, padding, columns, gutterMobile, maxWidthMobile])
    // useMemo(()=>{
    // }, [gs])
    // useMemo(()=>gridStyle.update(p), Object.values(p))

    const cssSetter = useCallback(e=>{
        const entry = e[0]
        // trace(entry)
        const width = entry.contentRect.width
        // const width = getSize().x - (Modernizr['platform-windows'] ? 17:0)
        const rvw = Math.min(width-(+padding*2), +maxWidth) * 0.01;
        // setCssVars(entry.contentRect.width, maxWidth, gutter, columns, entry.target)
        setCssVars({
            'rvw': `${rvw}px`,
            'grid-max-width': `${+gs.maxWidth}px`,
            'grid-columns': +gs.columns,
            'grid-gutter': `${+gs.gutter}px`,
            'grid-padding': `${+gs.padding}px`,
            'grid-bs': `${+gs.maxWidth/+gs.columns}px`,
        }, entry.target)

    },[gs])

    useResizeObserver(
        ref, 
        { select:e=>e.parentElement }, 
        cssSetter,
        [cssSetter]
    )
    
    return <div className="grid-style" ref={ref} style={{ display:'none' }}/>
}
GridStyle.displayName = 'GridStyle'

export const GridStyleWrapper = forwardRef((p, ref)=>{
    const parent = useGridStyle()
    const updateCtx = useCallback(p=>{
        // trace('updateCtx', ctx)
        // // if(ctx)
        // //     ctx.destroy()
        // const updatedCtx = {...ctx}//createGridStyleContext({ props:p, parent, onUpdate:updateCtx })
        // trace('updatedCtx', updatedCtx)
        setCtx(ctx)
    })

    const myCtx = useMemo(()=>createGridStyleContext({ parent, onUpdate:updateCtx }),[])

    const [ctx, setCtx] = useState(myCtx)

    // end of life
    useEffect(()=>{
        return ()=>ctx.release()
    },[])

    return (<GridStyleContext.Provider value={ctx}>{p.children}</GridStyleContext.Provider>)
})
GridStyleWrapper.displayName = 'GridStyleWrapper'

const directionClass = (c, r, d)=>c?('dir-column'):(r?'dir-row':'dir-'+d)
const mobDirectionClass = (c)=>c?`mobdir-${c}`:''
const discreteClass = v=>v?'adapt-discrete':''
const classyVal = v=>v==='screen'||v==='screen-ria'||!isNaN(+v)
const heightClass = v=>(v&&classyVal(v))?('height-'+v):''
const w100Class = v=>(v&&classyVal(v))?('width-w100'):''
const vw100Class = v=>(v&&classyVal(v))?('width-vw100'):''
const h100Class = v=>(v&&classyVal(v))?('height-h100'):''
const vh100Class = v=>(v&&classyVal(v))?('height-vh100'):''
const minHeightClass = v=>(v&&classyVal(v))?('min-height-'+v):''
const maxHeightClass = v=>(v&&classyVal(v))?('max-height-'+v):''
const widthClass = v=>(v&&classyVal(v))?('width-'+v):''
const leftClass = v=>(v&&classyVal(v))?('left-'+v):''
const rightClass = v=>(v&&classyVal(v))?('right-'+v):''
const alignClass = v=>v?('align-'+v):''
const valignClass = v=>v?('valign-'+v):''
const alignSelfClass = v=>v?('align-self-'+v):''
// const overlayClass = v=>v?'pos-overlay':''
const coverClass = v=>v?'size-cover':''
const reverseClass = v=>v?'dir-reverse':''
const wrapClass = v=>v?'dir-wrap':''

    // ${overlayClass(p.overlay)} \
const sliceBoxClass = p=>
    `slice ${p.className||''} \
    ${coverClass(p.cover)}\
    ${heightClass(p.height)} \
    ${maxHeightClass(p.maxHeight)} \
    ${minHeightClass(p.minHeight)}`

const sliceConClass = p=>
    `slice__container ${p.className||''} \
    ${directionClass(p.column, p.row, 'row')} \
    ${discreteClass(p.discrete)} \
    ${heightClass(p.height)} \
    ${minHeightClass(p.minHeight)} \
    ${maxHeightClass(p.maxHeight)} \
    ${widthClass(p.width)} \
    ${leftClass(p.left)} \
    ${rightClass(p.right)} \
    ${alignClass(p.align)} \
    ${alignSelfClass(p.alignSelf)} \
    ${valignClass(p.valign)} \
    ${reverseClass(p.reverse)}
    ${wrapClass(p.wrap)}`

const columnClass = p=>
    `column ${p.className||''} \
    ${directionClass(p.column, p.row, 'column')} \
    ${mobDirectionClass(p.mobDir)} \
    ${heightClass(p.height)} \
    ${h100Class(p.h100)} \
    ${w100Class(p.w100)} \
    ${vh100Class(p.vh100)} \
    ${vw100Class(p.vw100)} \
    ${minHeightClass(p.minHeight)} \
    ${maxHeightClass(p.maxHeight)} \
    ${widthClass(p.width)} \
    ${leftClass(p.left)} \
    ${rightClass(p.right)} \
    ${alignClass(p.align)} \
    ${valignClass(p.valign)} \
    ${reverseClass(p.reverse)}
    ${wrapClass(p.wrap)}`

    
const parseHeight = v=>v == 'screen' ? '100vh' : parseMeasures(v)
const parseWidth = v=>v == 'screen' ? '100vw' : parseMeasures(v)

const leftStyle = v=>(v&&!classyVal(v))?`margin-left:${parseMeasures(v)};`:''
const rightStyle = v=>(v&&!classyVal(v))?`margin-right:${parseMeasures(v)};`:''
const widthStyle = v=>(v&&!classyVal(v))?`width:${parseMeasures(v)};`:''
const heightStyle = v=>(v&&!classyVal(v))?`height:${parseHeight(v)};`:''
const minHeightStyle = v=>(v&&!classyVal(v))?`min-height:${parseHeight(v)};`:''
const maxHeightStyle = v=>(v&&!classyVal(v))?`max-height:${parseHeight(v)};`:''
const minWidthStyle = v=>(v)?`min-width:${parseWidth(v)};`:''
const maxWidthStyle = v=>(v)?`max-width:${parseWidth(v)};`:''

const sliceBoxStyle = p=>`${widthStyle(p.width)}${minHeightStyle(p.minHeight)}${maxHeightStyle(p.maxHeight)}${heightStyle(p.height)}`
const slicePadStyle = p=>`${heightStyle(p.height)}`
const sliceConStyle = p=>`${leftStyle(p.left)}${rightStyle(p.right)}${widthStyle(p.width)}${minHeightStyle(p.minHeight)}${maxHeightStyle(p.maxHeight)}${heightStyle(p.height)}`
const columnStyle = p=>`${leftStyle(p.left)}${rightStyle(p.right)}${widthStyle(p.width)}${minHeightStyle(p.minHeight)}${maxHeightStyle(p.maxHeight)}${heightStyle(p.height)}${minWidthStyle(p.minWidth)}${maxWidthStyle(p.maxWidth)}`

export const layoutStyleCustom = createStyle('layout')
// trace('layoutStyleCustom', layoutStyleCustom)

export const Slice = forwardRef((p, ref)=>{
    const {className, 
        // overlay, 
        cover, onClick, back, style, ...other} = p

    return <SliceBox 
                ref={ref} 
                className={className} 
                onClick={onClick} 
                style={style}
                back={back}
                height={p.height}
                >
                <SliceCon {...other}></SliceCon>
            </SliceBox>
})
Slice.displayName = 'Slice'

export const SliceBox = forwardRef((p, ref)=>{
    const customStyle = useMemo(()=>sliceBoxStyle(p), Object.values(p))
    const [uClassName] = useStyle(layoutStyleCustom, customStyle)
    // trace('SliceBox customStyle', customStyle)
// 
//     const inref = useRef()
// 
//     useEffect(()=>{
//         if(!ref) return
//         ref.current = inref.current
//     })

    // useLayoutEffect(()=>{
    //     if(!p.overlay) 
    //         return
    //     if(!inref.current) 
    //         return
    //     const cs = getComputedStyle(inref.current.parentElement)
    //     if(cs.position == 'static')
    //         inref.current.parentElement.style.position = 'relative'
    // }, [p.overlay])

    return (<div 
                ref={ref} 
                className={`${sliceBoxClass(p)} ${uClassName}`} 
                style={p.style}
                onClick={p.onClick}>
                {p.back}
                {p.children}
            </div>)
})
SliceBox.displayName = 'SliceBox'

export const SliceCon = forwardRef((p, outRef)=>{
    const padStyle  = useMemo(()=>slicePadStyle(p), Object.values(p))
    const [uPadClassName] = useStyle(layoutStyleCustom, padStyle)
    const customStyle = useMemo(()=>sliceConStyle(p), Object.values(p))
    const [uClassName] = useStyle(layoutStyleCustom, customStyle)
    // trace('SliceCon', uClassName)
    const gridStyle = useGridStyle()
    const [padClassName] = usePaddingStyle(p.padding)

    let ref = useRef()
    ref = outRef||ref
    useLayoutEffect(()=>{
        if(!ref.current)
            return

        const columns = p.width || gridStyle.columns()
        const maxWidth = p.maxWidth || gridStyle.maxWidth()

        setCssVars({
            'grid-columns': columns,
            'grid-bs': `${maxWidth/columns}px`,
        }, ref.current)

    },[p.width, p.maxWidth])

    return (<div className={cx("slice__pad", uPadClassName)}>
                <div ref={ref} className={cx(sliceConClass(p), uClassName, padClassName, 'maxw-'+gridStyle.maxWidth())} onClick={p.onClick}>
                        {p.children}
                </div>
            </div>)
})
SliceCon.displayName = 'SliceCon'

export const Column = forwardRef((p, ref)=>{
    const customStyle = useMemo(()=>columnStyle(p), Object.values(p))
    const [uClassName] = useStyle(layoutStyleCustom, customStyle)
    const [padClassName] = usePaddingStyle(p.padding)
    const gridStyle = useGridStyle()
    const gutterClass=p.useGutter?gridStyle.gutterClass():null

    return (<div 
                ref={ref} 
                className={cx(columnClass(p), uClassName, padClassName, gutterClass)} 
                style={p.style}
                onClick={p.onClick}
                onMouseEnter={p.onMouseEnter}
                onMouseLeave={p.onMouseLeave}
                tabIndex={p.tabIndex}
                data-index={p.dataIndex}
                >
                {p.children}
            </div>)
})
Column.displayName = 'Column'

export const Row = forwardRef((p, ref)=><Column ref={ref} row {...p}/>)
Row.displayName = 'Row'
