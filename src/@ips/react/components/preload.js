import React, { useContext, useRef, useState, useEffect, useLayoutEffect } from 'react'
import { useMemo, useCallback } from 'use-memo-one'
import { nop } from '@ips/app/hidash'
import createEventTargetHook from './utils/create-event-target-hook'

export const PreloadContext = React.createContext({ 
    preload:false, 
    preloader:()=>{}, 
    isLoaded:()=>true,
    loadingState:()=>({})
})

const DummyPreloader = {
    context:()=>PreloadContext
}

export const preloadable = (S, ctx)=>(p=><PreloadContext.Provider value={ctx}><S {...p}/></PreloadContext.Provider>)


const LS = {
    CANNOT_LOAD:-1,
    QUEUE:0,
    LOADING:1,
    LOADED:2,
}

export const usePreload = (url, type, { skipErr=true, onLoad }={} )=>{
    const ctx = useContext(PreloadContext)

    const [loadingState, _setLoadingState] = useState([false, null, LS.QUEUE])
    const setLoadingState = useRef((state, res)=>{
        if(locals.loadingState != state){
            locals.loadingState = state
            _setLoadingState([state==LS.LOADED, res, state])
        }
    }).current
    const locals = useRef({}).current

    useMemo(()=>{
        if(!ctx.preload || !url){
            setLoadingState(LS.LOADED, null)
            if(onLoad)
                onLoad(null)
        }else{
            const ls = ctx.loadingState(url)
            if(ls?.loaded){
                trace('me loadd before', url)
                setLoadingState(LS.LOADED, ls.result)
                if(onLoad)
                    onLoad(ls.result)
            }else
                // trace('have new url - setting to QUEUE', url)
                setLoadingState(LS.QUEUE, null)
        }
    }, [url])

    useEffect(()=>{
        if(locals.loadingState != LS.QUEUE)
            return

        const ls = ctx.loadingState(url)

        trace('prelo useEffect', url, locals.loadingState, loadingState, ls);
        if(ls?.loaded){
            setLoadingState(LS.LOADED, ls.result)
            if(onLoad)
                onLoad(ls.result)
            return
        }

        setLoadingState(LS.LOADING, null)

        const onErr = ()=>{
            error(err)
            setLoadingState(skipErr?LS.LOADED:LS.CANNOT_LOAD, null) // cant load - just go on then
            setResult()
            if(skipErr && onLoad)
                onLoad()
        }

        const prom = ls?.prom || ctx.preloader(url, type, ctx.priority)
        // trace('running preload', url)
        prom.then(
            result=>{
                trace('triggering preload done', url)
                setLoadingState(LS.LOADED, result)
                if(onLoad)
                    onLoad(result)
            },
            onErr)
            .catch(onErr)


    }, [onLoad, url, ctx])

    return loadingState
}

export const usePreloader= (Prelo, opts = {})=>{
    if(!Prelo)
        return DummyPreloader

    const { progress, step, log } = opts
    return useMemo(()=>new Prelo(opts), [Prelo, progress, step, log])
}

export const usePreloadWithPriority = (what, priority)=>{
    const ctx = useContext(PreloadContext)
    return (
        <PreloadContext.Provider value={{...ctx, priority }}>
            {what}
        </PreloadContext.Provider>
    )
}