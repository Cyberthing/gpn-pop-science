
export const destructMeasures = s=>{
    if(s == 'auto')
        return [s, s]
    const r = new RegExp(/^\s*([+-]?\d*[.]?\d+)(rvw|c|%|vh|vw|px|em)\s*$/)
    const res = r.exec(s)
    if(res){
        return [res[1], res[2]]
    }
}

export const parseMeasures = s=>{
	if(!s)
		return
    const d = destructMeasures(s)
    if(!d){
        warn('suspicious measure value', s)
        return s
    }
    if(d[1] == 'rvw'){
        return `calc(var(--rvw, 1vw) * ${d[0]})`
    }
    if(d[1] == 'c'){
        return `calc(var(--rvw, 1vw) / var(--grid-columns, 1vw) * 100 * ${d[0]})`
    }
    
    return s
}