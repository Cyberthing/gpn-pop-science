// require('whatwg-fetch')
// require('es6-promise/auto')

export const loadText = url =>new Promise((resolve, reject)=>
    fetch(url)
        .then(res=>{
            if(!res.ok){
                return Promise.reject(new Error(`${res.status}: ${res.statusText} ${url}`));
            }
            return res.text()
        })
        .then(resolve, errMsg=>reject(new Error(`${errMsg} in ${url}`)))
        // .catch(err=>{
        //     trace(err)
        // })
    )

export default loadText