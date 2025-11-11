import asyncQueue from 'async/priorityQueue'
import { loadVideo, loadImage, loadJson } from '@ips/app/load-media.js'
import * as __ from '@ips/app/hidash.js'

export default class Preloader{
    constructor(opts={}){
        this.progress = opts.progress||__.nop
        this.step = opts.step||0
        this.stepCount = 1
        this.log = opts.log
        this.streams = opts.streams || 10

        this.$pool = document.createElement('div')
        this.$pool.className = 'preload-pool'
        this.$pool.style.width="1px"
        this.$pool.style.height="1px"
        this.$pool.style.overflow="hidden"
        this.$pool.style.visibility="hidden"
        document.body.appendChild(this.$pool)

        this.queue = asyncQueue(async(task, cb)=>{
            // trace(`preload task`, task)
            const res = await task()
            this.preloadProgress ++
            if(this.log)
                trace(`preload ${this.preloadProgress}/${this.preloadTotal}`)
            cb(res)

        }, this.streams)
    }

    preloadTotal = 0
    preloadProgress = 0

    cbbulk = []

    $pool = null

    queue = null

    preloadHash = {}

    preloadCtx = {
        preload: true,
        preloader: (url, type, priority=1000)=>{
            const hash = this.preloadHash[url]
            if(hash && !__.ud(hash.prom)){
                trace('hashedd', url)
                return hash.prom
            }


            trace('adding prelo', url, priority);

            const f = (()=>{
                switch(type){
                    case 'video':
                        return ()=>loadVideo(url, this.$pool)
                    case 'image':
                        return ()=>loadImage(url, this.$pool)
                    case 'json':
                        return ()=>loadJson(url, this.$pool)
                    default:
                        return ()=>warn('unknown preload request', type, url)
                }
            })()
            const prom = new Promise(
                resolve=>this.queue.push(
                    f, 
                    priority, 
                    result=>{ 
                        // this.preloadHash[url] = {
                        //     loaded: true,
                        //     result,
                        // }
                        this.preloadHash[url].loaded = true
                        this.preloadHash[url].result = result
                        // resolve(result)
                        
                        if(this.log)
                            trace('preloadHash', url, priority);

                        this.cbbulk.push(()=>resolve(result))
                        if(this.stepCount == this.cbbulk.length || this.preloadTotal==this.preloadProgress){
                                this.progress(this.preloadProgress, this.preloadTotal)
                            // setTimeout(()=>{
                                // if(this.log)
                                //      trace('galooshka', this.preloadTotal, this.stepCount, this.cbbulk.length)
                                this.cbbulk.forEach(cb=>cb())
                                this.cbbulk = []
                            // },0)
                        }                        
                    }))

            this.preloadHash[url] = { prom }
            this.preloadTotal = (this.preloadTotal||0) + 1
            this.stepCount = Math.max(1, (this.step * this.preloadTotal)|0)
            return prom
        },
        loadingState: url=>this.preloadHash[url],
        isLoaded: url=>!!this.preloadHash[url]?.loaded,
        // isLoading: url=>this.preloadHash[url].prom.hasOwnProperty('then'),
        result: url=>this.preloadHash[url]?.result,
    }

    context = ()=>this.preloadCtx
}
