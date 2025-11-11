import React, { useState, useEffect, createContext, useContext } from 'react'
import { useMemo, useCallback } from 'use-memo-one'
import { createTextStyle, removeTextStyle, findTextStyle } from '@ips/app/font-utils'

const createTextStyleContext = parent=>createContext((()=>{
	const styles = {}
	return {
		create:(p, uid, sizes)=>{
            if(styles[uid]){
				trace('creating', uid, 'have', styles[uid])
                removeTextStyle(styles[uid][1])
            }

			styles[uid] = [p.name, createTextStyle(p, uid, sizes)]
            // trace('tscontext.create', p.name, uid, Object.values(styles))
			// trace('tscontext.created', styles[p.name])
			return styles[uid][1]
		},
		find: name => {
            const found = Object.values(styles).find(v=>v?(v[0]==name):false)
            return found?found[1]:null
        },
		remove: uid=>{
			// trace('tscontext.remove', uid, styles[uid])
            if(!styles[uid])
                return
			removeTextStyle(styles[uid][1])
			styles[uid] = null
		}
	}
})())

export const TextStyleContext = createTextStyleContext()

export const useTextStyle = (styleName)=>{
    const [val, setVal] = useState([])

    const textStyles = useContext(TextStyleContext)

    useEffect(()=>{
        const style = textStyles.find(styleName)||[]
        setVal(style)
    },[textStyles, styleName])

    return val
}
