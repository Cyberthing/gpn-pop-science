import React, { createContext, useContext, useRef, useState, useEffect, useLayoutEffect } from 'react'
import { useMemo, useCallback } from 'use-memo-one'
import { nop, ident, arrJoin } from '@ips/app/hidash'

const ress = {}

const Ext2Type = {
    'png':'img',
    'jpg':'img',
    'jpeg':'img',
    'gif':'img',
    'mp4':'video',
    'webm':'video',
}
export const Countifier = (opts)=>{
    const { onProgress=nop, onDone=nop, types, exts } = opts
    return [
        some=>{
            if(!some)
                return
            if(types){
                const ext = some.split('.').pop()
                if(types.includes(Ext2Type[ext]))
                    ress[some] = 1;
            }else
                ress[some] = 1;
        },
        some=>{
            if(!some || !ress[some])
                return
            ress[some] = null
            onProgress(Object.values(ress).filter(ident).length)
            if(!Object.values(ress).filter(ident).length)
                onDone()
        }
    ]
}

export const LoadingTrackersContext = createContext([])
export const createLoadingTracker = (Tracker, opts, checks)=>useMemo(()=>Tracker(opts), checks)

export const withLoadingTracker = (tracker, c)=>{
    const trackers = useContext(LoadingTrackersContext)
    return <LoadingTrackersContext.Provider value={tracker?arrJoin(trackers,[tracker]):trackers}>{c}</LoadingTrackersContext.Provider>
}

// export const useLoadingTracker = ()=>{
// }

export const useLoadingNotifier = ()=>{
    const trackers = useContext(LoadingTrackersContext)
    // trace('useLoadingNotifier', trackers)
    return [
        some=>trackers.forEach(([add])=>add(some)),
        some=>trackers.forEach(([add, done])=>done(some)),
    ]
}
