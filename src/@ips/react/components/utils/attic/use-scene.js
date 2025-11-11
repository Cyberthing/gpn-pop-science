import React, { createContext, useRef, useContext, useState, useLayoutEffect, useEffect } from 'react'
import useResize from '@ips/react/components/utils/use-resize'
import { useMemo, useCallback } from 'use-memo-one'
import { useSizerSize, useSizerOrientation } from '@ips/react/components/utils/use-sizer'
import { useMutationObserver } from '@ips/react/components/utils/use-mutation-observer'
import { objEqualShallow, nop } from '@ips/app/hidash'
import { windowSize } from '@ips/app/dom-utils'
import { RiaSceneLogic, StandaloneSceneLogic, createSceneLogic } from '@ips/app/scene-logic'

const mutaConfig = 	{ 
	attributes: true,
	attributeFilter: ['class']
}

export const useSceneDeprecated = ()=>{
	const ws = useResize(null, { noScrollbar:true })//, intervalDelay:-1 })
    const [ ssize ] = useSizerSize()
    // const [ sorient ] = useSizerOrientation()
    const mobile = !ssize

    const calcScene = useRef((ws, ria, mobile)=>{
			let w = Math.min(1440, ws.width)
			let h = ws.height
			if(Modernizr['inline-ria'])
				h-=40
			if(ria.lentaActive){ 
				// because of the site's logic inconsistency we cannot rely on the html/body class flags 
				// and have to check the size of the screen here
				h-= w < 1235 ? 50 : 80
				if(Modernizr['platform-ios']&&Modernizr['browser-safari'])
					h -= 30
			}

			return({ 
				width: w, 
				height: h, 
				vert:h>w, 
				aspect:w/h, 
				mobile, 
				inlineRia: Modernizr['inline-ria'],
				...ria,
				// set:true
			})
    }).current

    const calcRia = useRef(()=>({ 
    	lentaActive: document.body.classList.contains('m-widget-lenta-active'),
    	riaHeaderSticked: document.body.classList.contains('m-header-sticked'),
    })).current

    const [ria, setRia] = useState(calcRia)
    const [scene, setScene] = useState(()=>calcScene(ws, ria, mobile))

    const mutaCB = useRef(somn=>{
		// console.log('somn',  somn)

		if(somn.filter(mr=>mr.type == 'attributes' && mr.attributeName == 'class').length)
			setRia(calcRia())

	}).current

	useMutationObserver(document.body, mutaConfig, mutaCB)

	useLayoutEffect(()=>{
		const nuscene = calcScene(ws, ria, mobile)
		if(!objEqualShallow(scene, nuscene))
			setScene(nuscene)
	},[ws.width, ws.height, ria.lentaActive, mobile])

	return scene
}

const dummyScene = {}

const SceneCtx = createContext(dummyScene)

export const useScene = ()=>{
	const sceneCtx = useContext(SceneCtx)
	return sceneCtx
}

export const withScene = (s, c)=><SceneCtx.Provider value={s}>{c}</SceneCtx.Provider>

export { RiaSceneLogic, StandaloneSceneLogic, createSceneLogic }