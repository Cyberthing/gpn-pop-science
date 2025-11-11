import app from './app.js'

app.registry = app.registry || {}

var requests = {}

var listeners = {
    create:{},
    update:{},
    destroy:{},
}

export function register(name, o){
    // trace('app.register', name)
    app.registry[name] = o

    // execute deferred requests and clear
    if(requests[name]){
        requests[name].forEach(r => r(o))
        requests[name] = []
    }
}

export function unregister(name){
    // if(app.registry[name] != o){
    //     warn('app registry: trying to unregister wrong object', name, o)
    //     return
    // }
    app.registry[name] = null;
}

// registerEventEmitter, unregisterEventEmitter

export async function request(list, opts){
    // trace('app.request', list.join(' '))
    const res = await Promise.all(list.map(c => {
        if(app.registry[c])
            return Promise.resolve([c, app.registry[c]])

        //schlangify
        return new Promise((resolve, reject)=>{
            requests[c] = requests[c]||[]
            requests[c].push( o => resolve([c, o]) )
        })
    }))

    // trace('gatabba', res)

    return res.reduce((a, c)=>{ a[ c[0] ] = c[1]; return a }, {})
}

export async function on(event, cb){
    const s = event.split('.')
    if(e.length != 2){
        error('dispatcher: wrong event format', event)
        return
    }
    const o = s[0]
    const e = s[1]

    listeners[e][o] = listeners[e][o] || []
    listeners[e][o].push(cb)
}
