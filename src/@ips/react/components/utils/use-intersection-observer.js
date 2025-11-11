import React, { useState, useContext, useLayoutEffect, useEffect, useRef } from 'react'
import { times, isArray, isString, isDOMElement } from '@ips/app/hidash'

const buildThresholdList = c=>times(c, i=>i/c)

export const useIntersectionObserver = ($el, opts={})=>{
    const [visible, setVisible] = useState()
    const locals = useRef({}).current

    // this is nececessary to trigger init of the intersection observer
    const [rendered, setRendered] = useState()
    useLayoutEffect(()=>{
        setRendered(true) 
    },[])

    useLayoutEffect(()=>{
        // trace('useIntersectionObserver ', $el)
        if(!$el){
            if(locals.visible != opts.default){
                locals.visible = opts.default
                setVisible(opts.default)
            }
            return 
        }

        const { mode='toggle', ratio=0, rootMargin } = opts
        let root = opts.root
        root = isString(root)?document.querySelector(root):isDOMElement(root)?root:null

        const handleIntersect = (()=>
            (mode == 'once' ? 
                inters =>{
                    if(!locals.visible && inters[0].intersectionRatio > ratio){
                        locals.visible = true
                        setVisible(true)
                    }
                } : 
            (mode == 'toggle' ? 
                inters =>{
                    // trace('inters[0].intersectionRatio', inters[0].intersectionRatio)
                    const newvis = inters[0].intersectionRatio > ratio
                    if(locals.visible != newvis){
                        // trace('shmoshom', inters[0].intersectionRatio)
                        locals.visible = newvis
                        setVisible(newvis)
                    }
                }: 
            (mode == 'always' ? 
                inters => setVisible(inters[0].intersectionRatio > ratio)
                    : 
                null
            ))))()

        let observerOptions = {
            root,
            rootMargin: rootMargin||"0px",
            // threshold: [0, 0.1, 0.2, ],
            //rootMargin: `${ 0 }px 0px ${ -700 }px 0px`,//(-300)+'px',//
            threshold: buildThresholdList(10)//.5
        };

        // trace('handleIntersect', handleIntersect)

        if(!handleIntersect)
            return

        if(!isArray($el))
            $el = [$el]
        
        const observer = new IntersectionObserver(handleIntersect, observerOptions);
        $el.forEach($$el=>{
            const $o = $$el.hasOwnProperty("current")?$$el.current:$$el
            $o&&observer.observe($o)
        });

        return ()=>observer.disconnect()

    },[opts.mode, $el])


    return visible
}

export default useIntersectionObserver