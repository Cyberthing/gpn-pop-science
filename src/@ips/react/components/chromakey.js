import React, { Component, useRef, useState, useLayoutEffect, useEffect } from 'react';
import {  useMemo } from 'use-memo-one'

import GLChroma from './lib/gl-chromakey'
import { useRafLoop, useUpdate } from 'react-use';

import { Vidos } from '@ips/react/components/vidos'

const useChromakey = (refVideo, refCanvas, opts = {})=>{
    const { mode='HSV', color=[0, 255, 0], tolerance=0, edge=1., colorMode='RGB' } = opts;

    const [chroma, setChroma] = useState()

    // useMemo(()=>,[])
    useEffect(()=>{
        if(chroma)
            return
        if(!refVideo.current || !refCanvas.current)
            return
        // trace('chrochro', refVideo, refCanvas)

        const chro = new GLChroma(refVideo.current, refCanvas.current)
        chro.key({mode, color, tolerance:+tolerance, edge:+edge, colorMode})
        setChroma(chro)
    })

    useEffect(()=>{
        if(!chroma)
            return
        if(refVideo.current)
            chroma.source(refVideo.current)
        if(refCanvas.current)
            chroma.target(refCanvas.current)
    },[chroma, refVideo.current, refCanvas.current])

    useEffect(()=>{
        if(!chroma)
            return
        // trace('updating chroma params', mode, color, tolerance, edge, colorMode)
        chroma.key({mode, color, tolerance:+tolerance, edge:+edge, colorMode})
    },[chroma, mode, color, tolerance, edge, colorMode])

    return chroma
}

export const Chromakey = p=>{
    const {srcId, src, autoPlay, loop, onCanplay, onFinish, ...opts } = p

    const refCanvas = useRef()
    // const videoCan = useRef()

    const [ videoCtl, setVideoCtl ] = useState({})
    const [ videoStarted, setVideoStarted ] = useState()

    // TODO: resize canvas according to the video

    const chroma = useChromakey({ current: videoCtl.ref }, refCanvas, opts)

    // const [chroma, setChroma] = useState()

    const [stopRenderLoop, startRenderLoop, isActive] = useRafLoop((time) => {
        if(!chroma)
            return
        // trace('rendering', chroma)

        if(videoStarted)
            chroma.render()
    }, false);

    useEffect(()=>{
        if(autoPlay && videoStarted)
            startRenderLoop()
        else
            stopRenderLoop()
    },[autoPlay, videoStarted])

    return <>
                <canvas width="1920" height="1080" ref={refCanvas} style={{ width:'100%' }}/>
                <Vidos 
                    style={p.showVideo?null:{display:'none'}}
                    onCanplay={s=>{
                        // trace('can play', s)
                        // if(!videoCtl)
                        if(onCanplay)
                            onCanplay(s)
                        if(videoCtl.ref != s.ref)
                            setVideoCtl(s)
                    }} 
                    onProgress={videoStarted?null:(p=>setVideoStarted(true))}
                    onFinish={()=>{
                        setVideoStarted(false)
                        if(onFinish)
                            onFinish()
                    }}
                    srcId={srcId}
                    src={src}
                    autoPlay={autoPlay} 
                    loop={loop}
                    playOffscreen
                    muted
                />
            </>
}

export default Chromakey