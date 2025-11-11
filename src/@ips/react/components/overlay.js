import React, { useRef, useLayoutEffect, useState, forwardRef } from 'react'
import { useMemo } from 'use-memo-one'
import "./overlay.styl"

// import { register, unregister } from "@ips/app/app-registry"
import { ud } from '@ips/app/hidash'

// import { requestUrl } from '@ips/app/resource'
import cx from '@ips/app/classnamex'
import { usePreload } from './preload'
import { enqueueLoading, useRefImageLoad, LS } from '@ips/react/components/utils/use-loading-queue'
import { useResourceProvider } from './utils/resource'
// import { useExprContext } from './utils/react-expr'
import { createStyle, useStyle } from '@ips/react/components/utils/use-style'
import { parseMeasures } from '@ips/app/parse-measures'

const overlayStyles = createStyle('ovl')

const posStyle = p=>`left:${ud(p.right) ? parseMeasures(p.left) : '0px'}; right: ${parseMeasures(p.right)}; top: ${ud(p.bottom) ?  parseMeasures(p.top) : '0px'}; ${(p.width||p.cover||p.w100)?`width: ${parseMeasures(p.width)||'100%'}`:''};${(p.maxWidth)?`max-width: ${parseMeasures(p.maxWidth)}`:''}; ${(p.height||p.cover||p.h100)?`height: ${parseMeasures(p.height)||'100%'}`:''}; bottom: ${parseMeasures(p.bottom)}`

const aprc = x=>`${Math.abs(x)*100}%`
const auto = "auto"
const initial = undefined;//"initial"

const lposStyle = p=>{
    if(ud(p.lx)&&ud(p.ly))
        return null

    const x = (+p.lx)||0
    const y = (+p.ly)||0
    const px = aprc(x)
    const py = aprc(y)
    const tm = [(x>0?'-':'')+px, (y>0?'-':'')+py]
    return  { 
                left: !ud(p.lx) && x >= 0 ? px : initial, 
                right: !ud(p.lx) && x < 0 ? px : initial,
                top: !ud(p.ly) && y >= 0 ? py : initial, 
                bottom: !ud(p.ly) && y < 0 ? py : initial,
                transform:`translate3d(${tm}, 0)`,
                WebkitTransform: `translate3d(${tm}, 0)`,
            }
}

const bkgSizeStyle = p=>p.mode=='background'?`background-size: ${ud(p.backgroundSize)?'cover':p.backgroundSize};`:''
const bkgPosStyle = p=>p.mode=='background'?`background-position: ${ud(p.backgroundPosition)?'center':p.backgroundPosition};`:''
const bkgRepeatStyle = p=>p.mode=='background'?`background-repeat: ${ud(p.backgroundRepeat)?'no-repeat':p.backgroundRepeat};`:''
const bkgMixStyle = p=>ud(p.mixBlendMode)?'':`mix-blend-mode: ${p.mixBlendMode};`
const bkgBlendStyle = p=>ud(p.backgroundBlendMode)?'':`background-blend-mode: ${p.backgroundBlendMode};`
const bkgImageStyle = (p, src, srcset, allowLoading)=>(p.mode=='background'&&src)?
        `background-image: url(${allowLoading?src:''}); background-image: -webkit-image-set(${allowLoading?srcset.map(s=>`url(${s[0]}) ${s[1]}`).join(' ,'):''});`
        :''
const bkgColorStyle = p=>ud(p.backgroundColor)?'':`background-color: ${p.backgroundColor};`

const overlayStyle = (p, src, srcset, allowLoading)=>`${bkgImageStyle(p, src, srcset, allowLoading)}${bkgColorStyle(p)}${bkgSizeStyle(p)}${bkgPosStyle(p)}${bkgRepeatStyle(p)}${bkgMixStyle(p)}${bkgBlendStyle(p)}${posStyle(p)}`

const faderStyle = createStyle('ovl')
// const faderClass = genClassName('pic-fader')
// faderStyle.addRule(`.overlay.loading`, 'opacity:0;')
// faderStyle.addRule(`.overlay`, 'transition: opacity 1s; opacity:1;')

export const Overlay = forwardRef((p, ref)=>{
    const { requestUrl } = useResourceProvider()

    const psrc = p.img||p.src
    const src = useMemo(()=>(psrc ? requestUrl(psrc, 'image') : null), [psrc])
    const srcset = useMemo(()=>{
        if(!src) return []
        const x = [[src, '1x']]
        if(p.res2x){
            const ss = src.split('.')
            const s0 = ss.slice(0,-1).join('.')
            x.push([s0+'@2x.'+ss[ss.length-1], '2x'])    
        }
        return x
    }, [src, p.res2x])


    // const [loaded] = usePreload(src, 'image')
    const [allowLoading, tellLoaded] = enqueueLoading(src)
    // trace('Overlay src', psrc, src, allowLoading)

    // const [useExpr] = useExprContext()
    // const eclassName = useExpr('className', p.className)
    const eclassName = p.className
    // trace('eclassName', eclassName)

    const ostyle = useMemo(()=>overlayStyle(p, src, srcset, allowLoading), [
        allowLoading, 
        p.height,
        p.width,
        p.maxWidth,
        p.mode, 
        p.top,
        p.left,
        p.bottom,
        p.right,
        src, 
        srcset,
        p.backgroundColor,
        p.backgroundSize,
        p.backgroundPosition,
        p.backgroundRepeat,
        p.mixBlendMode,
        p.backgroundBlendMode,
    ])
    
    const [styleClass] = useStyle(overlayStyles, ostyle)

    const style = useMemo(()=>{
        let s = p.style||{}
        const ls = lposStyle(p)        
        if(ls)
            s = {...s, ...ls}

        return s
    }, [p.style, p.lx, p.ly])
    

    let myref = useRef()
    myref = ref||myref

    useLayoutEffect(()=>{
        if(!myref.current) 
            return
        const cs = getComputedStyle(myref.current.parentElement)
        if(cs.position == 'static')
            myref.current.parentElement.style.position = 'relative'
    },[myref.current])

    let lref = useRef()
    if(p.mode == 'img')
        lref = myref

    const loadingState = useRefImageLoad(lref, tellLoaded)

    const className = useMemo(
        ()=>cx(
            'overlay', 
            p.mode&&`overlay_${ p.mode }`,
            p.w100&&`overlay_w100`,
            p.h100&&`overlay_h100`,
            (p.cover||p.sizeCover)&&'overlay_cover',
            p.vh100&&'overlay_vh100',
            p.tangible&&'overlay_tangible',
            p.ghost&&'overlay_ghost',
            eclassName,
            styleClass,
            loadingState&&'loading',
        ), 
        [
            p.mode,
            p.w100,
            p.h100,
            p.cover,
            p.sizeCover,
            p.vh100,
            p.tangible,
            p.ghost,
            eclassName,
            styleClass
        ])

    // trace('computed style', style)

    return useMemo(()=>((p.mode == 'img') ?
            <img ref={myref} className={ className } src={ allowLoading?src:null} srcSet={srcset.map(s=>s.join(' ')).join(',')} style={ style } onClick={p.onClick}/>
        :
            <div 
                ref={myref} 
                className={ className } 
                style={ style } 
                onClick={p.onClick}>
                    { p.children }
                    { loadingState==LS.NOT_LOADED && src ? <img ref={lref} src={ allowLoading?src:null } style={{display:'none'}}/> : null }
            </div>), 
            [
                className,
                allowLoading,
                src,
                style,
                // p.ghost,
                p.mode,
                p.children,
                p.onClick
            ])
})
Overlay.displayName="Overlay"

export default Overlay
Overlay.OverlayF = Overlay
