import React from 'react'

export const createFactory = ()=>{
	const dict = {}

	return {
		register: (s, C)=>{
			dict[s] = C
		},
		get(t){
			return dict[t]
		},
		create(p, i){
			const C = dict[p.__typename]
			if(!C)
				return null
			return <C key={i} index={i} {...p}/>
		}
	}
}

export const factory = createFactory()

export default factory