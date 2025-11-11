export const trimTrailingSlashes = s => s.replace(/^(.+?)\/*?$/, "$1")
export const trimPathFilename = s => s.replace(/[^\/]*$/, "")
export const pathRHead = s => s.split('/').slice(-1).join() // path's reverse head (last part)
export const pathRTail = s => s.split('/').slice(0,-1).join('/') // path's reverse tail (all except the last part)
export const parseQueryParams = s => s.split('&').map(p=>p.split('=')).reduce((a, v)=>( a[v[0]] = decodeURIComponent(v[1]), a), {})
export const getParamsFromUrl =  url => parseQueryParams( url ? (url.split('?')[1])||'' : location.search.slice(1) )

export const findAncestor = (e, p)=>{
    while(e){
        const r = p(e)
        if(r)
            return r
      e = e.parentElement
    }
}

export const findArr = (e, p)=>{
    for (let i = 0; i < e.length; i++) {
        const r = p(e[i])
        if(r)
            return r
    }
}

export const strIncludes = (s, ss) => s.indexOf(ss) > -1
