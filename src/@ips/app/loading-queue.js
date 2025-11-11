import priorityQueue from 'async/priorityQueue.js'
import { loadVideo, loadImage, loadJson } from '@ips/app/load-media.js'
import { ud, nop } from '@ips/app/hidash.js'

const deprom = ()=>{
    const a = {}
    a.prom = new Promise((resolve, reject)=>{
        a.resolve = resolve
        a.reject = reject
    })
    return a
}

export default class LoadingQueue{
    constructor(opts={}){
        this.progress = opts.progress||nop
        this.step = opts.step||0
        this.stepCount = 1
        this.log = opts.log
        this.streams = opts.streams || 6

        if(this.log)
            trace('new LoadingQueue');

        this.queue = priorityQueue(async(task, cb)=>{

            // trace(`preload task`, task)
            const res = await task()
            this.loadProgress ++
            if(this.log)
                trace(`queue load ${this.loadProgress}/${this.loadTotal}`)
            cb(res)

            if(this.log)
                trace('LoadingQueue loadHash', this.loadHash)

        }, this.streams)
    }

    loadTotal = 0
    loadProgress = 0

    cbbulk = []

    queue = null

    loadHash = {}

    queueCtx = {
        enqueue: (url, priority, allow)=>{
            if(ud(priority)||priority==null)
                priority = 1000
            let hash = this.loadHash[url]

            if(this.log)
                trace('hashedd', url, hash)
            
            if(!hash){

                if(this.log)
                    trace('adding queue load', url, priority);

                const render = deprom()

                hash = {
                    render,
                }
                this.loadHash[url] = hash

                this.queue.push(
                    ()=>{
                        allow()
                        return render.prom
                    },
                    priority, 
                    result=>{ 
                        // this.loadHash[url] = {
                        //     loaded: true,
                        //     result,
                        // }
                        this.loadHash[url].loaded = true
                        this.loadHash[url].result = result
                        // resolve(result)
                        
                        if(this.log)
                            trace('loadHash', url, priority);

                        this.progress(this.loadProgress, this.loadTotal)

                        // this.cbbulk.push(()=>resolve(result))
                        // if(this.stepCount == this.cbbulk.length || this.loadTotal==this.loadProgress){
                        //         this.progress(this.loadProgress, this.loadTotal)
                        //     // setTimeout(()=>{
                        //         // if(this.log)
                        //         //      trace('galooshka', this.loadTotal, this.stepCount, this.cbbulk.length)
                        //         this.cbbulk.forEach(cb=>cb())
                        //         this.cbbulk = []
                        //     // },0)
                        // }                        
                })

                this.loadTotal = (this.loadTotal||0) + 1
                this.stepCount = Math.max(1, (this.step * this.loadTotal)|0)
            }else{
                allow()
                // trace('giving back hashed', url, hash)
            }

            return [hash.loaded, hash.render.resolve]
        },
        loadingState: url=>this.loadHash[url],
        isLoaded: url=>!!this.loadHash[url]?.loaded,
        // isLoading: url=>this.loadHash[url].prom.hasOwnProperty('then'),
        result: url=>this.loadHash[url]?.result,
    }

    context = ()=>this.queueCtx
}
