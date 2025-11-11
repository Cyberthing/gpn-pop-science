import React, { createContext, useRef, useContext, useState, useLayoutEffect, useEffect } from 'react'
import { useMemo, useCallback } from 'use-memo-one'

export const useMutationObserver = ($el, config, cb)=>{
    // const [muru, setMuru] = useState()
    useLayoutEffect(()=>{
        const mutabor = new MutationObserver(cb)
        mutabor.observe($el, config)
        return ()=>mutabor.disconnect()
    },[$el, cb])
}

export const defaultConfig =  { 
    attributes: true,
    attributeFilter: ['class']
}
