import React, { Component, useState, useContext, useEffect, useRef, useCallback, useMemo } from 'react'
import { PreloadContext } from "@ips/react/components/preload"
import { ActivationContext } from "@ips/react/components/activation"
import * as __ from "@ips/app/hidash"

import { requestUrl } from '@ips/app/resource.js'

import './vidos.styl'

const srcUrl = v => v ? (v + '.mp4') : undefined
const posterUrl = v => v ? (v + '.jpg') : undefined
const posterFromSrc = v => v ? (v.split('.').slice(0, -1).join('.') + '.jpg') : undefined

const _setupVideoHandlers = (videoEl, opts = {})=>{
    // trace('_setupVideoHandlers', videoEl)
    if(!videoEl) return

    const { onCanplay, 
            onFinish, 
            onProgress, 
            playing,
            progressThrottle = .5 
        } = opts

    // trace('svh', playing)

    // const { onFinish = __.nop, onCanplay = __.nop, autoPlay } = props

    let canplayHandlers = []
    let endHandlers = []
    let progressHandlers = []

    // setTimeout(()=>{ 
    //     debugMsg('runnong ' + videoEl.readyState)
    //     trace('runnong', videoEl.readyState)
    // }, 0)
    // videoEl.addEventListener('readystatechange', ()=>{
    //     debugMsg('readystatechange ' + videoEl.readyState)
    //     trace('readystatechange', videoEl.readyState)
    //     if(videoEl.readyState >= 3)
    //         videoEl.play()
    // })

    if(onCanplay){
        canplayHandlers.push(onCanplay)
        videoEl.addEventListener('canplay', onCanplay)
    }

    if(onFinish){
        endHandlers.push(onFinish)
        videoEl.addEventListener('ended', onFinish)
    }

    if(onProgress && !videoEl.paused){
        progressHandlers.push(setInterval(()=>onProgress(videoEl.currentTime), progressThrottle*1000))
    }

    return ()=>{
        // cleanup listeners
        progressHandlers.forEach(h=>clearInterval(h))
        endHandlers.forEach(h=>videoEl.removeEventListener('ended', h))
        canplayHandlers.forEach(h=>videoEl.removeEventListener('canplay', h))
    }
}


const _setVideoPlay = (videoEl, play)=>{
    if(!videoEl) return

    if(play)
        videoEl.play()
    else
        videoEl.pause()
}

const _rewindVideo = videoEl=>videoEl.currentTime = 0

export const Vidos = p => {

    const preloadCtx = useContext(PreloadContext)
    // const { preload, preloader } = preloadCtx
    // trace('preloadCtx', preloadCtx)

    const [ loaded, setLoaded ] = useState(false)
    const [ playing, setPlaying ] = useState(false)
    const [ finished, setFinished ] = useState(false)

    const ref = useRef(null)

    const onFinish = useCallback(()=>{
        // trace('///////////////// onfinish //////////')
        p.onFinish()
        setFinished(true)
        // if(!p.loop)
        //     setPlaying(false)
    }, [
        p.onFinish, 
        p.loop
    ])

    const src = requestUrl(srcUrl(p.srcId), 'video')
    const poster = requestUrl(posterUrl(p.srcId), 'video')

    // Гипотеза: не работает прелоад для видео не включенного в ДОМ
    
    // Running preload
    useEffect(()=>{
        if(loaded) return

        if(!preloadCtx.preload){ // cant do - just go on then
            setLoaded(true)
            return
        }

        (async ()=>{ 
            trace('settug prelaoder')
            await preloadCtx.preloader(src, 'video')
            trace('prelaoded', src)
            setLoaded(true)
        })()
    },
    [
        src,
        loaded,
        preloadCtx.preload
    ])

    // Setting up events
    useEffect(()=>_setupVideoHandlers(ref.current, { ...p, onFinish }),[
        ref.current,
        playing,
        finished,
        p.onCanplay,
        onFinish,
        p.onProgress,
        p.progressThrottle,
    ])

    // Updating 'autoPlay' logic
    useEffect(()=>{
        if(!loaded) return

        // trace('autoPlay logic', playing, p.autoPlay, finished)

        if(!playing && p.autoPlay){
            if(p.rewind){
                _rewindVideo(ref.current)
                if(finished)
                    setFinished(false)
            }
        }

        if(!playing && !finished && p.autoPlay){
            _setVideoPlay(ref.current, true)
            setPlaying(true)
        }

        if(playing && !p.autoPlay){
            _setVideoPlay(ref.current, false)
            setPlaying(false)
        }

    },[
        ref.current,
        loaded,
        playing,
        finished,
        p.autoPlay,
        p.rewind,
        p.loop,
    ])

    const renderVideo = useCallback(
        ()=><video 
                ref={ref} 
                className="video" 
                playsInline 
                //autoPlay={p.autoPlay}
                muted={p.muted} 
                loop={p.loop} 
                src={src} 
                poster={poster}/>
        ,[
            ref,
            // p.autoPlay,
            p.muted,
            p.loop,
            src,
            poster,
        ])

    // trace('susbasm', ref, loaded)
    if(!loaded) return null

    return (p.mode == 'background' ? 
                (<div className="video-frame mode-background">
                    {renderVideo()}
                </div>) : 
                    renderVideo()
            )
}

export default Vidos