import React, { useLayoutEffect, useCallback, useMemo, useState } from 'react'
import throttle from '@ips/app/throttle'
import { ud } from '@ips/app/hidash'
import { getFullOffsetTop, windowSize, windowScrollY, parseOffset } from '@ips/app/dom-utils'
import createEventTargetHook from '@ips/react/components/utils/create-event-target-hook'

const calcPadding = ($el, padding, pbottom, ws)=>{
    if(!$el) return {top:0, bottom:0}

    // TODO: parse them separately
    const top = padding ? parseOffset( padding, this.$el.offsetHeight, ws ) : 0
    const bottom = top + (pbottom ? -parseOffset( pbottom, $el.offsetHeight, ws ) : 0)

    return {top, bottom}
}

const calcOffset = (boxedge, top, ws)=>{
    ws = ws||windowSize()
    // const node = this.$el
    return top ? (-parseOffset(top, ws.y, ws)) : parseOffset(boxedge, ws.y, ws)// - parseOffset(this.state.edge, node.offsetHeight)
}

const emptee = {}
export const useScrollTrackerCb = (ref, p, cb, check)=>{
	p = p || emptee

	const cbb = useCallback(cb, check)
	const [updater, setUpdater] = useState()

	const target = document.querySelector(p.target)|| window
    const useTargetEvent = useMemo(()=>createEventTargetHook(target), [target])
    const scrollY = useMemo(()=>((target == window) ? windowScrollY : ()=>(target.scrollTop||0)), [target])
    useTargetEvent('scroll', updater)

    useLayoutEffect(()=>{
    	if(!ref.current)
    		return

	    const padding = calcPadding(ref.current, p.padding, p.bottom)
	    const offset = calcOffset(ref.current, p.boxedge, p.top)

		let pos

        // trace('direp')
        const upda = ()=>{
            // trace('upda', ee)
            // trace('upda2',  scrollY())

            const y = scrollY()
            const ws = windowSize()

            const node = ref.current
            const ofs = y + offset - (getFullOffsetTop(node) + padding.top)
            const height = Math.max(1, node.offsetHeight - (padding.top + padding.bottom))
            const newPos = Math.min(1, Math.max(0, ofs/height))
            // trace(ofs, height, newPos)
            if(pos != newPos){
                pos = newPos
                // trace(newPos)
                cb({ pos: newPos, ofs:Math.min(height, Math.max(0, ofs)) })
            }
        }

        const updater = (+p.throttle) === 0 ? upda: throttle(upda, ud(p.throttle) ? 100 : p.throttle)

    	// trace('useScrollTrackerCb')
    	setUpdater(()=>updater)

    	return ()=>setUpdater()
    },[cbb])
}

export const useScrollTracker = (ref, config, cb, check)=>{
	const [value, setValue] = useState({})
	useScrollTrackerCb(ref, config, setValue)
	return value
}

export default useScrollTracker