import React, { useRef, useContext, useState, useMemo, useCallback, useEffect, useLayoutEffect } from 'react';
import Base from '@ips/react/components/base'
// import PropTypes from 'prop-types';
import cx from '@ips/app/classnamex'
import { useResourceProvider } from './utils/resource'
import { request, register } from '@ips/app/app-registry'
import { loadScript } from '@ips/app/utils'
import app from '@ips/app/app'
import * as __ from '@ips/app/hidash'
import { loadJson } from '@ips/app/load-media'
import { useActivation } from '@ips/react/components/activation'
import { PreloadContext } from '@ips/react/components/preload'
import { enqueueLoading } from '@ips/react/components/utils/use-loading-queue'
// import { useExprContext } from '@ips/react/components/utils/react-expr'

// trace('gevaq')

import './lottie.styl'
// <style lang="stylus">

// .lottie
//     position absolute
//     top 0px
//     width 100%
//     height 100%
//     pointer-events none

// </style>

// const purl = url => `${ app.publicPath ? (app.publicPath + '/') : '' }${ url }`

// trace('looking for lottie script', purl('lib/lottie.min.js'))
loadScript('https://dc.ria.ru/ips/lib/lottie574.min.js').then(()=>{
// loadScript(purl('lib/lottie.min.js')).then(()=>{
    // trace('bodymovin loaded')
    register('bodymovin', bodymovin)
})

const buildLottie = async($el, props, animationData, requestUrl)=>{
    const { anim, speed, autoPlay, loop, loopstart, loopend, renderer='svg' } = props


    // const state = current
    await request(['bodymovin'])
    // trace('got bodymovin', anim)

    if(!animationData){  // if it hasnt been preloaded - load anyways
        const animDataUrl = requestUrl(`${ anim }.json`, 'lottie', { path:'', usePrefixDir:false })
        // trace('loading json anim', animDataUrl)
        animationData = await loadJson(animDataUrl)
    }

    // trace('got lottie data for', anim)

    // trace('buildLottie', anim, speed, loop, autoPlay, requestUrl('images'))

    var params = {
        container: $el,
        renderer,
        loop,
        autoplay: false,
        animationData,
        assetsPath:requestUrl('images')+'/',
        // path: animDataUrl
    }

    const animInstance = bodymovin.loadAnimation(params)
    // trace('animInstance', animInstance)

    // if(!__.ud(fixStroke)){
    //     const $svg = animInstance.renderer.svgElement
    //     if($svg){
    //         const mazod = [...$svg.querySelectorAll('path,line,circle')]
    //         mazod.forEach($el=>$el.setAttribute('stroke-width', fixStroke))

    //     }
    // }

    if(!autoPlay)
        setTimeout(()=>animInstance.goToAndStop(0),0)

    if(!__.ud(speed))
        animInstance.setSpeed(+speed)

    // animInstance.addEventListener('DOMLoaded', ()=>{
    //     // trace(`lottie ${ anim } loaded: ${ this.anim.getDuration(true) }frames, ${ this.anim.getDuration() }s`)
    // })

    if(props.responsive && animInstance.renderer.svgElement){
        animInstance.renderer.svgElement.setAttribute('width',"100%")
        animInstance.renderer.svgElement.setAttribute('height',"100%")
    }

    if(loopstart){
        animInstance.addEventListener('DOMLoaded', ()=>{
            const loopStart = loopstart||0
            const loopEnd = loopend||animInstance.getDuration(true)

            const inSeg = ()=> animInstance.playSegments([0, loopStart], true)
            const loopSeg = ()=> animInstance.playSegments([loopStart, loopEnd], true)

            inSeg()
            animInstance.addEventListener('complete', loopSeg)
        })
    }

    return animInstance
}


const destroyLottie = (anim)=>{
    if(!anim) return
    anim.destroy()
}

const findel = (elements, nm)=>{
    if(!elements)
        return

    let la = elements.find(el=>el.data.nm == nm)

    if(!la){
        for(let i = 0; i < elements.length; i++){
            const el = elements[i]
            la = findel(el.elements, nm)
            if(la)
                break
        }
    }

    return la
}

const makeInfo = (l, name)=>({
    ctl:l,
    name:()=>name,
    length:()=>l.totalFrames,
    fps:()=>l.frameRate,
    paused:()=>l.isPaused,
    current:(rf)=>rf?l.currentFrame:(l.currentFrame+l.firstFrame),
    layers:()=>l.renderer.layers,
    $root:()=>l.renderer.svgElement,
    $layer:(nm)=>{
        const la = findel(l.renderer.elements, nm)
        // trace('lookn 4', nm, la)
        trace('LOTTIE mount point found', la)
        if(!la) return
        return la.transformedElement//l.renderer.layerElement.children[la.ind-1]
    }
})

export const Naked = React.forwardRef((p, outref)=>{
    const { $container, autoPlay } = p
    // if(!$container)
    //     return null

    // const ref = useRef()
    const [ loading, setLoading ] = useState(false)
    const [ anim, setAnim ] = useState(null) // i.e. !loading
    const [ info, setInfo ] = useState(null)
    // const [ active, setActive ] = useState(false)
    // const ctxActive = useActivation()
    const ctxPreload = useContext(PreloadContext)
    const [current, setCurrent] = useState(0)
    // const [ useExpr ] = useExprContext() // create a new Expr Context and get a custom useExpr hook from it

    // trace('incantameria', p.anim, p.className)//$container, info)

    const { requestUrl } = useResourceProvider()

    const animDataUrl = requestUrl(`${ p.anim }.json`, 'lottie', { path:'', usePrefixDir:false })
    const [allowLoading, tellLoaded] = enqueueLoading(animDataUrl)

    // trace('LottieF', p)
    useLayoutEffect(()=>{
        // trace('LottieF.useLayoutEffect', p.anim, allowLoading, loading, $container, anim)
        if(!allowLoading) return
        if(anim || loading) return
        if(!$container) return
        if(!p.anim && !p.animData) return

        try{
            (async()=>{
                try{
                    setLoading(true)
                    // trace('loading lottie', p.anim, p.className)


                    let animationData = null
                    if(p.animData){
                        animationData = p.animData
                    }else
                    if(p.anim){
                        // const animDataUrl = requestUrl(`${ p.anim }.json`, 'lottie', { path:'', usePrefixDir:false })
                        try{
                            animationData = await loadJson(animDataUrl)
                            tellLoaded()
                        }catch(err){
                            error('lottieerr', err)
                        }
                        // trace('preloaded lottie', animDataUrl, p.className, animationData)
                    }
                    setLoading(false)

                    // if(!animationData)
                    //     return

                    const a = await buildLottie($container, p, animationData, requestUrl)
                    a.goToAndStop(0)
                    // trace('have lottie', a, p.anim, p.animData)
                    setAnim(a)
                    const ainfo = makeInfo(a, p.name||p.anim)
                    setInfo(ainfo)

                    if(outref)
                        outref.current = ainfo.$root()

                    if(p.onLoad){
                        p.onLoad()
                    }
                    if(p.onInfo){
                        p.onInfo(ainfo)
                    }
                } catch(err){
                    error(err)                
                }
            })()

            return ()=>{
                try{
                    if(!anim)
                        return
                    // trace('DESTR', anim)
                    anim.destroy()
                    setAnim(null)
                } catch(err){
                    error(err)                
                }
            }
        } catch(err){
            error(err)                
        }
    },
    [
        $container,
        anim,
        allowLoading,
        p.anim,
        p.animData,
    ])

    useMemo(()=>{
        if(!anim) return

        // trace('Lottie: autoPlay', p.anim, autoPlay, anim.isPaused)

        // if(ctxActive != active){
            // trace('changing lottie', anim, anim.isPaused, p.anim, ctxActive)
            if(autoPlay){
                if(anim.isPaused){
                    // trace('starting anim', p.anim)
                    setTimeout(()=>anim.play(), 0)
                }
            }
            else{
                if(!anim.isPaused)
                    anim.stop()
            }
            // setActive(ctxActive)
        // }
    },[
        anim,
        autoPlay,
        // active,
        // ctxActive,
        loading
    ])

    // const pcurrent = useExpr('current', p.current)
    const pcurrent = p.current

    useMemo(()=>{
        if(!anim) return

        // trace('Lottie: setting current', p.current, current)

        if(current != pcurrent){
            setCurrent(pcurrent)
            anim.goToAndStop(pcurrent, true)
        }
    },[pcurrent, current])

    // const renderCon = useCallback(
    //     ()=><div ref={ref} className={`lottie ${ p.className||'' }`} style={p.style}/>,[
    //         ref.current,
    //         p.className
    //     ])

    // return renderCon()

    return useMemo(()=>($container&&info) ? (React.Children.map(p.children, c=>
                React.cloneElement(c, { $container:info.$root(), info }))||null) : null
    , [p.children, info, $container])
    //<div ref={ref} className={`lottie ${ p.className||'' }`} style={p.style}/>
})

export const MountPoint = p=>{
    // trace('amamam', p)
    const { $container, info, children, node } = p

    return useMemo(()=>($container&&info) ? React.Children.map(children, c=>React.cloneElement(c, { $container: info.$layer(node), info })): null, [children, info, $container, node])
}

// TODO (?) : use DomContainer instead
export const Lottie = React.forwardRef((p, outref)=>{
    const { className, style, ...pp } = p
    const ref = useRef()
    const [ container, setContainer ] = useState()

    useEffect(()=>{
        if(ref.current != container){
            setContainer(ref.current)
        }
    },[ref.current, container])

    return <div ref={ref} className={cx('lottie', className)} style={style}>
                <Naked ref={outref} $container={container} {...pp}/>
            </div>
})

Lottie.displayName = 'Lottie'
Naked.displayName = 'Lottie.Naked'

//<Lottie anim="base">
//    <Lottie.Naked anim="char"/>
//    <Lottie.MountPoint node="char_mover">
//        <Lottie.Naked anim="char"/>
//    </Lottie.MountPoint>
//</Lottie>

export default Lottie
Lottie.LottieF = Lottie
Lottie.Naked = Naked
Lottie.MountPoint = MountPoint

        // props:['anim', 'speed', 'loop', 'loopstart', 'classname'],
            // lottieLib: (app.publicPath + '/lib/lottie.min.js'),
            // loop:true,
            // speed:1.,