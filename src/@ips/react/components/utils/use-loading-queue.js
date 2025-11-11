import React, { createContext, useContext, useRef, useState, useEffect, useLayoutEffect } from 'react'
import { useMemo, useCallback } from 'use-memo-one'
import { nop, ident } from '@ips/app/hidash'
import createEventTargetHook from './create-event-target-hook'

import LQ from '@ips/app/loading-queue'
import { loadJson } from '@ips/app/load-media'

import { useLoadingNotifier } from './use-loading-tracker'

export const LoadingQueue = LQ

export const LoadingQueueContext = createContext({ 
    useQueue:false, 
    enqueue:(url, prio, allow)=>{ allow(); return [true, nop] }, 
    // isLoaded:()=>true,
    // loadingState:()=>({})
})

const DummyQueue = {
    context:()=>LoadingQueueContext
}

// this has no deps so you should re-create the component in order to reset the queue
export const useLoadingQueue = (Q, opts = {})=>{
    if(!Q)
        return DummyQueue

    const [q] = useState(()=>new Q(opts))
    return q
}

export const withLoadingQueue = (lq, what)=>{
    return (
        <LoadingQueueContext.Provider value={lq.context()}>
            {what}
        </LoadingQueueContext.Provider>
    )
}

export const enqueueWithPriority = (what, priority, key)=>{
	// return what
    const ctx = useContext(LoadingQueueContext)
    // trace('useEnueueWithPriority ctx', ctx, priority)
    return (
        <LoadingQueueContext.Provider value={{...ctx, priority }} key={key}>
            {what}
        </LoadingQueueContext.Provider>
    )
}

export const enueueWithPriority = enqueueWithPriority

const constenava = [true, nop, true]

export const enqueueLoading = (url, { onPora }={} )=>{
    const ctx = useContext(LoadingQueueContext)

    const [ allow, setAllow ] = useState()

    if(!url || !ctx)
    	return constenava
    
    const [loaded, tellDone] = ctx.enqueue(url, ctx.priority, ()=>(!allow)&&setAllow(true))

    // if(loaded)
    	// return constenava
 
    return [allow||loaded, tellDone, loaded]
}


export const LS = {
    ERROR:-1,
    NOT_LOADED:0,
    LOADED:1,
}

// 
// const notifiers = []
// 
// const Cuntifier = (opts)=>{
//     const { onDone=nop } = opts
//     let counter=0
//     return [
//         ()=>counter++,
//         ()=>{
//             counter--
//             if(!counter)
//                 onDone()
//         }
//     ]
// }
// 
// 
// const LoadingTrackersContext = createContext([])
// export const createLoadingTracker = (Tracker, opts, checks)=>useMemo(()=>Tracker(opts), checks)
// 
// export const withLoadingTracker = (tracker, c)=>{
//     const trackers = useContext(LoadingTrackersContext)
//     return <LoadingTrackersContext.Provider value={tracker?arrJoin(trackers,[tracker]):trackers}>{c}</LoadingTrackersContext.Provider>
// }
// 
// // export const useLoadingTracker = ()=>{
// // }
// 
// const ress = {}
// export const useLoadingNotifier = ()=>{
//     const trackers = useContext(LoadingTrackersContext)
//     return [
//         some=>trackers.forEach(([add])=>add(some)),
//         some=>trackers.forEach(([add, done])=>done(some)),
//         // some=>{
//         //     ress[some]=null
//         //     trace('gotchered', Object.values(ress).filter(ident).length, some, ress) 
//         // }
//     ]
// }

export const useRefImageLoad = (ref, cb)=>{
    // trace('useRefImageLoad', ref.current, cb)

    const [curelli, setCurelli] = useState()
    const [state, setState] = useState(LS.NOT_LOADED)

    const imgEvent = useMemo(()=>createEventTargetHook(curelli), [curelli])

    const [notifierAdd, notifierDone] = useLoadingNotifier()

    useLayoutEffect(()=>{ 
        notifierAdd(ref.current?.src) 
    },[ref.current])

    useLayoutEffect(()=>setCurelli(ref.current),[ref.current])


    const handlers = useMemo(()=>cb?
        [
            ()=>{
                cb(true)
                setState(LS.LOADED)
                notifierDone(ref.current?.src)
            },
            ()=>{
                cb(false)
                setState(LS.ERROR)
                notifierDone(ref.current?.src)
            }
        ]
        :
        [
            ()=>{
                setState(LS.LOADED)
                notifierDone(ref.current?.src)
            },
            ()=>{
                setState(LS.ERROR)
                notifierDone(ref.current?.src)
            },
        ]
    ,[cb])

    imgEvent('load', state==LS.NOT_LOADED?handlers[0]:null)
    imgEvent('error', state==LS.NOT_LOADED?handlers[1]:null)

    return state
}


// const canplayEvent = (Modernizr['platform-iphone']||Modernizr['platform-ipad'])?'loadedmetadata':'canplay'
const canplayEvent = Modernizr['browser-safari']?'loadedmetadata':'canplay'

export const useRefVideoLoad = (ref, cb)=>{
    // trace('useRefVideoLoad', ref.current, cb)

    const [curelli, setCurelli] = useState()
    const [state, setState] = useState(LS.NOT_LOADED)

    const videoEvent = useMemo(()=>createEventTargetHook(curelli), [curelli])

    const [notifierAdd, notifierDone] = useLoadingNotifier()

    useLayoutEffect(()=>{ 
        notifierAdd(ref.current?.src) 
    },[ref.current])

    useLayoutEffect(()=>setCurelli(ref.current),[ref.current])

    const handlers = useMemo(()=>cb?
        [
            ()=>{
                cb(true)
                notifierDone(ref.current?.src)
                setState(LS.LOADED)
            },
            ()=>{
                cb(false)
                notifierDone(ref.current?.src)
                setState(LS.ERROR)
            }
        ]
        :
        [
            ()=>{
                setState(LS.LOADED)
                notifierDone(ref.current?.src)
            },
            ()=>{
                setState(LS.ERROR)
                notifierDone(ref.current?.src)
            },
        ]
    ,[cb])

    videoEvent(canplayEvent, state==LS.NOT_LOADED?handlers[0]:null)
    videoEvent('error', state==LS.NOT_LOADED?handlers[1]:null)

    return state
}

export const useJsonLoad = (url, cb)=>{
	const [state, setState] = useState()
	const [data, setData] = useState()
	const [loading, setLoading] = useState()

	useLayoutEffect(()=>{
		if(loading) return
		if(state != LS.NOT_LOADED) return
		setLoading(true)
		loadJson(url).then((res)=>{
			setState(LS.LOADED)
			setLoading(false)
			cb(res)
		})

	},[url, cb])

	return [state, data]
}
