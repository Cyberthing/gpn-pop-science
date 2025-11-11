import React, { useRef, forwardRef } from 'react'
import { useMemo } from 'use-memo-one'

// import { requestUrl } from '@ips/app/resource'
import { usePreload } from './preload'
import cx from '@ips/app/classnamex'
import { ud } from '@ips/app/hidash'

import { useGridStyle, usePaddingStyle, layoutStyleCustom } from '@ips/react/components/layout'
import { createStyle, useStyle, genClassName } from '@ips/react/components/utils/use-style'
import { enqueueLoading, useRefImageLoad, LS } from '@ips/react/components/utils/use-loading-queue'

import { useResourceProvider } from './utils/resource'

import './pic.styl'

const faderStyle = createStyle('pic')
// const faderClass = genClassName('pic-fader')
faderStyle.addRule(`.pic.loading`, 'opacity:0;')
faderStyle.addRule(`.pic`, 'transition: opacity 1s; opacity:1;')

const parseSize = v=>v == 'screen' ? '100vh' : v
const maxWidthStyle = v=>(v)?`max-width:${parseSize(v)};`:''
const widthStyle = v=>(v)?`width:${parseSize(v)};`:''
const heightStyle = v=>(v)?`height:${parseSize(v)};`:''
const maxHeightStyle = v=>(v)?`max-height:${parseSize(v)};`:''
const bkgImgStyle = (src, srcset, allowLoading)=>src?`background-image:url(${allowLoading?src:''});${srcset?`background-image: image-set(${allowLoading?srcset.map((s, i)=>`url(${s}) ${i+1}x`).join(' ,'):''});`:''}`:''
const aspectStyle = aspect=>aspect?`padding-bottom: ${aspect*100}%;`:''

const inStyle = (p, src, srcset, allowLoading)=>`${p.mode == 'background'&&src ? bkgImgStyle(src, srcset, allowLoading): ''}${!ud(p.height)?(heightStyle(p.iHeight||'100%')):widthStyle(p.iWidth||'100%')}`
const outStyle = (p, allowLoading)=>`${maxHeightStyle(p.maxHeight)}${maxWidthStyle(p.maxWidth)}${widthStyle(p.width)}${heightStyle(p.height)}${(p.mode=='background'|| !allowLoading) ? aspectStyle(p.aspect):''}`

export const Pic = forwardRef((p, ref)=>{
    const { requestUrl } = useResourceProvider()
    
    const src = useMemo(()=>requestUrl(p.src, 'image'), [p.src])
    const srcset = useMemo(()=>{
        if(!src || !p.res2x) return null
        const x = [[src, '1x']]
        if(p.res2x){
            const ss = src.split('.')
            if(ss[ss.length-1] != 'svg'){ // skip res2x for svgs
                const s0 = ss.slice(0,-1).join('.')
                x.push([`${s0}@2x.${ss[ss.length-1]}`, '2x'])    
            }
        }
        return x
    }, [src, p.res2x])


    const [allowLoading, tellLoaded] = enqueueLoading(src)
    const onLoad = useMemo(()=>p.onLoad?()=>{ tellLoaded(); p.onLoad() } : tellLoaded, [p.onLoad, tellLoaded])

    // trace(`pic src ${src} loaded ${loaded}`, srcset)

    // const sizeClass = ud(p.height)?'hsize':'vsize'

    // const instyle = useMemo(()=>({
    //     backgroundImage: p.mode == 'background' ? `url(${ loaded?src:'' })`: undefined,
    // }), [loaded,src,p.mode])

    // const outstyle = useMemo(()=>({
    //     paddingBottom: p.aspect?`${p.aspect*100}%`:undefined
    // }), [p.aspect])

    const instyle = useMemo(()=>inStyle(p, src, srcset, allowLoading), [allowLoading, p.mode, src, srcset])
    const outstyle = useMemo(()=>outStyle(p, allowLoading), [p.width, p.maxWidth, p.maxHeight, p.aspect, p.mode, allowLoading])
    const [instyleClass] = useStyle(layoutStyleCustom, instyle)
    const [outstyleClass] = useStyle(layoutStyleCustom, outstyle)

    // trace('outstyle', outstyle)

    const gridStyle = useGridStyle()
    const gutterClass = gridStyle.gutterClass()
    const [paddingClass] = usePaddingStyle(p.padding)


    const lref = useRef()
    const loadingState = useRefImageLoad(lref, onLoad)

    const className = useMemo(()=>cx('pic', outstyleClass, p.className, !(p.noGutter)&&gutterClass, paddingClass, loadingState==LS.NOT_LOADED&&'loading'), [p.className, gutterClass, paddingClass, loadingState])

    return useMemo(()=>((p.mode == 'background') ?
            <div ref={ref} className={className} style={p.style}>
                <div className={cx(instyleClass)}>
                </div>
                <img style={{display:'none'}} ref={lref} src={ allowLoading?src:null } srcSet={(srcset&&allowLoading)?srcset.map(s=>s.join(' ')).join(','):null}/>
            </div>
        :
            <div ref={ref} className={className} style={p.style}>
                <img ref={lref} className={cx(instyleClass)} src={ allowLoading?src:null } srcSet={(srcset&&allowLoading)?srcset.map(s=>s.join(' ')).join(','):null} draggable="false" onClick={p.onClick}/>
            </div>), 
            [
                className,
                allowLoading,
                src,
                instyleClass,
                outstyleClass,
                p.mode,
                p.children,
                p.style
            ])
})
Pic.displayName='Pic'

export default Pic
