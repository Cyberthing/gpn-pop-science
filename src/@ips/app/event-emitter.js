import { isFunction, isNumber } from './hidash.js'

export default class EventEmitter{

    constructor(ref){
        this.ref = ref // reference object or id
        this.cbs = {}    
    }
    
    fire = (evt, opts)=>{
        if(this.cbs[evt]){
            // trace(`firing ${this.cbs[evt].length} ${evt}`)

            // clone to prevent troubles with addition/removal in the callbacks
            let cbs = this.cbs[evt].slice()
            for(let i = 0; i < cbs.length; i++){
                cbs[i](opts)
            }
        }
    }

    on = (evt, cb)=>{
        if(!isFunction(cb)) 
            return

        // trace('EventEmitter on', cb)

        this.cbs[evt] = this.cbs[evt]||[]
        this.cbs[evt].push(cb)
    }

    off = (evt, cb)=>{
        const cbs = this.cbs[evt]
        if(!cbs) return

        const i = cbs.indexOf(cb)
        if(i != -1){
            // trace('EventEmitter off')

            // remember: splice works inplace!
            cbs.splice(i, 1)
        }else{
            // trace('EventEmitter_off cantfind', cb)
        }
    }

    addEventListener = this.on
    removeEventListener = this.off
}

