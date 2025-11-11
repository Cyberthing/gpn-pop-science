import React, { createContext, useContext, useRef, useState, useEffect, useLayoutEffect } from 'react'
import { requestUrl } from '@ips/app/resource'

export const ResourceProviderContext = createContext({ 
    requestUrl
})

export const useResourceProvider = ()=>useContext(ResourceProviderContext)

export const withResourceProvider = (rp, what)=>{
    return (
        <ResourceProviderContext.Provider value={rp}>
            {what}
        </ResourceProviderContext.Provider>
    )
}
