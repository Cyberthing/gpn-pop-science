import React, { Component, Fragment, forwardRef, useState, useContext, useLayoutEffect, useEffect, useRef } from 'react'
import { useMemo, useCallback } from 'use-memo-one'

import { usePreload } from "@ips/react/components/preload"
import { enqueueLoading, useRefImageLoad, useRefVideoLoad, LS } from '@ips/react/components/utils/use-loading-queue'
import {useIntersectionObserver} from "@ips/react/components/utils/use-intersection-observer"
import { ActivationContext } from "@ips/react/components/activation"
import { nop, ud } from "@ips/app/hidash"
import cx from "@ips/app/classnamex"
// import UnsafeHtml from '@ips/react/components/unsafe-html'

// import { requestUrl } from '@ips/app/resource.js'
import { createStyle } from '@ips/app/css-utils'
import { useResourceProvider } from './utils/resource'

import { useExprContext } from "@ips/react/components/utils/react-expr"

// import './vidos.styl'

const srcUrl = v => v ? (v + '.mp4') : undefined
const posterUrl = (v, ext='jpg') => v ? `${v}.${ext}` : undefined
const posterFromSrc = v => v ? (v.split('.').slice(0, -1).join('.') + '.jpg') : undefined

const dummySoundData = "data:audio/mpeg;base64,SUQzBAAAAAABEVRYWFgAAAAtAAADY29tbWVudABCaWdTb3VuZEJhbmsuY29tIC8gTGFTb25vdGhlcXVlLm9yZwBURU5DAAAAHQAAA1N3aXRjaCBQbHVzIMKpIE5DSCBTb2Z0d2FyZQBUSVQyAAAABgAAAzIyMzUAVFNTRQAAAA8AAANMYXZmNTcuODMuMTAwAAAAAAAAAAAAAAD/80DEAAAAA0gAAAAATEFNRTMuMTAwVVVVVVVVVVVVVUxBTUUzLjEwMFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVf/zQsRbAAADSAAAAABVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVf/zQMSkAAADSAAAAABVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV";
const dummySound = new Audio()

export const audioHook = ()=>{
    document.body.appendChild(dummySound)
    dummySound.src = dummySoundData
    dummySound.play()
}

const vidStyle = createStyle('vidos')
vidStyle.addRaw(`
video.vidos {
    display: block;
}

.video-frame {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
}

.video-frame.mode-background video {
    object-fit: cover;
    width: 100%;
    height: 100%;
}

.browser-ie .video-frame.mode-background video {
    position: absolute;
    top: 50%;
    left: 50%;
    width: auto;
    height: auto;
    min-width: 100%;
    min-height: 100%;
    transform: translate(-50%, -50%);
}

`)

const canplayEvent = Modernizr['browser-safari']?'loadedmetadata':'canplay'

const createProgressHandler = ($videoEl, onProgress)=>{
    let curProgress = $videoEl.currentTime
    return ()=>{
        if(curProgress != $videoEl.currentTime){
            onProgress($videoEl.currentTime, $videoEl.duration)
            curProgress = $videoEl.currentTime
        }
    }
}

const _setupVideoHandlers = (videoEl, opts = {})=>{
    // trace('_setupVideoHandlers', videoEl)
    if(!videoEl) return

    const { onCanplay, 
            onFinish, 
            onProgress, 
            // playing,
            progressThrottle = .5 
        } = opts


    // const { onFinish = nop, onCanplay = nop, autoPlay } = props

    let canplayHandlers = []
    let endHandlers = []
    let progressHandlers = []
    let rscHandlers = []

    // setTimeout(()=>{ 
    //     debugMsg('runnong ' + videoEl.readyState)
    //     trace('runnong', videoEl.readyState)
    // }, 0)
    // rscHandlers.push(()=>{
    //     // debugMsg('readystatechange ' + videoEl.readyState)
    //     trace('readystatechange', videoEl.readyState)
    //     // if(videoEl.readyState >= 3)
    //         // videoEl.play()
    // })
    // videoEl.addEventListener('readystatechange', rscHandlers[0])

    // videoEl.addEventListener('loadedmetadata', ()=>trace('loadedmetadata'))
    // videoEl.addEventListener('loadeddata', ()=>trace('loadeddata'))
    // videoEl.addEventListener('canplay', ()=>trace('canplay'))

    // const canplayEvent = 'canplay'
    // const canplayEvent = (Modernizr['platform-iphone']||Modernizr['platform-ipad'])?'loadedmetadata':'canplay'

    // if(Modernizr['plaform-ios']){
    //     videoEl.muted = false
    //     videoEl.volume = 100
    // }

    if(onCanplay){
        // trace('svh onCanplay', onCanplay, videoEl, videoEl.readyState)
        if(videoEl.readyState > 3) // has been already loaded
            onCanplay()
        canplayHandlers.push(onCanplay)
        videoEl.addEventListener(canplayEvent, onCanplay)
    }

    if(onFinish){
        endHandlers.push(onFinish)
        videoEl.addEventListener('ended', onFinish)
    }

    if(onProgress){
        progressHandlers.push(setInterval(createProgressHandler(videoEl, onProgress), progressThrottle*1000))
    }

    return ()=>{
        // cleanup listeners
        // trace('cleanup listeners')
        progressHandlers.forEach(h=>clearInterval(h))
        endHandlers.forEach(h=>videoEl.removeEventListener('ended', h))
        canplayHandlers.forEach(h=>videoEl.removeEventListener(canplayEvent, h))
        rscHandlers.forEach(h=>videoEl.removeEventListener('readystatechange', h))
    }
}


const _setVideoPlay = (videoEl, play)=>{
    if(!videoEl) return

    try{

    // trace('_setVideoPlay', play)

    if(play){
        const pp = videoEl.play()
        pp.catch(err=>trace('_setVideoPlay', err))
        return pp
    }
    else
        videoEl.pause()

    }catch(err){
        error(err)
    }
}

// !video.paused or video.paused === false doesn't necessarily 
// indicate the video is playing - it just tells you "video.play() was fired 
// but the video could still be loading or playing". 
// To detect if it's playing use the video.onplaying event to detect it's now loaded and playing 
// e.g. video.onplaying = function() { console.log('Video is now loaded and playing'); }

const _isVideoPlaying = videoEl=>!videoEl.paused

const _setVideoMuted = (videoEl, muted)=>{
    if(!videoEl) return
    videoEl.muted = muted
}

const _setVideoCurrentTime = (videoEl, t)=>{
    if(!videoEl) return
    videoEl.currentTime = t
}

const _rewindVideo = videoEl=>videoEl.currentTime = 0

export const Vidos = forwardRef((p, outref) => {

    const { playOffscreen, noPoster, prePlay } = p
    const { requestUrl } = useResourceProvider()

    // const preloadCtx = useContext(PreloadContext)
    // const { preload, preloader } = preloadCtx
    // trace('preloadCtx', preloadCtx)

    const ref = useRef()
    if(outref)
        outref.current = ref.current

    const local = useRef({}).current


    const src = requestUrl(p.srcId?srcUrl(p.srcId):p.src, 'video')
    // trace('Vidos', p.src, src)
    const poster = noPoster?null:requestUrl(p.poster||posterUrl(p.srcId, p.posterExt), 'image')
    const [rendered, setRendered] = useState(false)
    const [preplaying, setPreplaying] = useState()

    // Running preload
    // const [posterLoaded] = usePreload(poster, 'image')
    // const [loaded] = usePreload(src, 'video')
    const [allowPosterLoading, tellPosterLoaded] = enqueueLoading(poster)
    const [allowVideoLoading, tellVideoLoaded] = enqueueLoading(src)


    // const [ playing, setPlaying ] = useState(false)
    // const [ finished, setFinished ] = useState(false)

    const className = p.className


    let vref = useRef()
    if(p.mode != 'background')
        vref = ref

    // trace('Vidos local.$video', local.$video)
    // trace('allowPosterLoading', allowPosterLoading)

    const visible = useIntersectionObserver((!playOffscreen)&&local.$video, { mode:'toggle', default:playOffscreen })

    const pref = useRef()

    // const bulali = useRef(()=>{
    //     tellPosterLoaded()
    //     trace('posterLoaded')
    // }).current
    const posterLoadingState = useRefImageLoad(pref, tellPosterLoaded)
    const videoLoadingState = useRefVideoLoad(vref, tellVideoLoaded)


    // Setting up events
    const onFinish = useCallback(()=>{
        // trace('///////////////// onfinish //////////')
        if(p.onFinish)
            p.onFinish()
        // setFinished(true)
        // if(!p.loop)
        //     setPlaying(false)
    }, [
        p.onFinish, 
        p.loop
    ])

    const onCanplay = useCallback(()=>{
        // trace('hava', p.onCanplay)
        if(p.onCanplay){
            p.onCanplay({
                ref:local.$video,
                setProgress: p=>{
                    _setVideoCurrentTime(local.$video, p)
                },
                progress: ()=>local.$video?local.$video.currentTime:null,
                duration: ()=>local.$video?local.$video.duration:null,
            })
        }

        if(prePlay && !local.preplaid && !preplaying){
            // trace('rinning preplay')
            _setVideoPlay(local.$video, true)
            setPreplaying(true)
        }
    },[ p.onCanplay, prePlay ])

    useLayoutEffect(()=>{
        local.$video = vref.current
        // trace('useLayoutEffect local.$video', local.$video, vref.current)
        if(local.$video)
            setRendered(true)
    })

    useLayoutEffect(()=>{
        if(!local.$video)
            return
        local.$video.muted = p.muted
    },[p.muted])

    useLayoutEffect(()=>{
        if(!local.$video || ud(p.volume))
            return
        local.$video.volume = p.volume
    },[p.volume])

    useEffect(()=>{
        if(!preplaying)
            return

        setTimeout(()=>{
            // trace('preplaid', p.srcId, local.$video)
            local.preplaid = true
            _setVideoPlay(local.$video, false)
            _setVideoCurrentTime(0)        
            setPreplaying(false)
        },0)
    },[preplaying])

    useEffect(()=>_setupVideoHandlers(local.$video, { ...p, onCanplay, onFinish }),[
        local.$video,
        // playing,
        // finished,
        onCanplay,
        onFinish,
        p.onProgress,
        p.progressThrottle,
    ])

    // Updating 'autoPlay' logic
    useEffect(()=>{
        // if(outref)
            // outref.current = local.$video
        // trace(`autoPlay logic`, local.$video, `videoLoadingState:${videoLoadingState} autoPlay:${p.autoPlay} finished:${finished} visible:${visible}`)

        if(videoLoadingState != LS.LOADED || !local.$video) return

        if(local.autoPlay && !p.autoPlay && p.rewind){
            _rewindVideo(local.$video)
            // local.rewindFlag = true
            // if(finished)
            //     setFinished(false)            
        }
        local.autoPlay = p.autoPlay

        // trace('going autoPlay', p.autoPlay, visible, _isVideoPlaying(local.$video))

        const letsplay = p.autoPlay && visible

        if(!_isVideoPlaying(local.$video) && letsplay){
            // if(p.rewind && local.rewindFlag){
            //     local.rewindFlag = false
            //     // trace('rewindoong', src)
            //     _rewindVideo(local.$video)
            //     if(finished)
            //         setFinished(false)
            // }
        }

        if(!_isVideoPlaying(local.$video) 
            // && !finished 
            && letsplay){
            const prom = _setVideoPlay(local.$video, true)
            if(p.onPlayStarted)
                prom.then(p.onPlayStarted)
            // setPlaying(true)
        }

        if(_isVideoPlaying(local.$video) && !letsplay){
            _setVideoPlay(local.$video, false)
            // setPlaying(false)
        }

    },[
        local.$video,
        outref,
        videoLoadingState,
        // playing,
        visible,
        // finished,
        p.autoPlay,
        p.rewind,
        p.loop,
    ])

    // trace('updating vid', p.muted)
    useEffect(()=>{
        if(videoLoadingState != LS.LOADED || !local.$video) return
        // trace('updating muted', p.muted)
        _setVideoMuted(local.$video, p.muted)
    },[
        local.$video,
        videoLoadingState,
        p.muted,
        // playing,
    ])

    const [useExpr] = useExprContext()
    const setCur = useRef((cur=0)=>{
        // trace('oncha', cur)
        if(!local.$video)
            return
        local.$video.currentTime = cur*(local.$video.duration||0)
    }).current
    useExpr('current', p.current, setCur)

    // Rendering
    const renderMedia = useCallback(
        ({ className }={})=><Fragment>
                <video 
                    ref={vref}
                    style={p.style}
                    className={cx("vidos" , className)}
                    playsInline 
                    webkit-playsinline="true"
                    crossOrigin="anonymous"
                    //autoPlay={p.autoPlay}
                    muted={p.muted} 
                    preload={p.preload}
                    loop={p.loop} 
                    controls={p.controls}
                    width={p.width}
                    src={allowVideoLoading?src:null} 
                    poster={posterLoadingState==LS.LOADED?poster:null}
                />
                {/* Cannot do this just yet because of the LoadingNotifiers 
                    { posterLoadingState != LS.LOADED ?  */}
                    <img 
                        ref={pref}
                        src={allowPosterLoading?poster:null} 
                        style={{ display:'none' }} 
                    /> 
                {/* : null  */}
            </Fragment>
        ,[
            p.style,
            allowPosterLoading,
            allowVideoLoading,
            // p.autoPlay,
            p.muted,
            p.loop,
            p.controls,
            src,
            poster,
            posterLoadingState,
            className,
        ])

    // trace('susbasm', ref, loaded)
    if(!allowVideoLoading && !allowPosterLoading) return null

    // return (
    //    <div 
    //         className={cx(className, p.mode == 'background'&&"video-frame mode-background")} 
    //         ref={ref} 
    //         style={p.style}
    //         dangerouslySetInnerHTML={{__html:`
    //             <video 
    //                className="video" 
    //                playsinline 
    //                webkit-playsinline
    //                crossorigin="anonymous"
    //                ${p.muted?"muted":""}
    //                ${p.loop?"loop":""}
    //                ${p.controls?"controls":""}
    //                src="${loaded?src:null}"
    //                poster="${poster}"/>
    //         `}}
    //     />
    // )

    return (p.mode == 'background' ? 
                (<div ref={ref} className={`video-frame mode-background ${className||''}`}>
                    {renderMedia()}
                </div>)
                :
                    renderMedia({className})
            )
})
Vidos.displayName = 'Vidos'

export default Vidos

