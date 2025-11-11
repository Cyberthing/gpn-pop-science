import asyncQueue from 'async/priorityQueue'
import { loadVideo, loadImage, loadJson } from '@ips/app/load-media'
import * as __ from '@ips/app/hidash'

export default class Preloader{
    constructor(opts={}){
        this.progress = opts.progress||__.nop
    }

    preloadTotal = 0
    preloadProgress = 0

    queue = asyncQueue(async(task, cb)=>{
        // trace(`preload task`, task)
        const res = await task()
        this.preloadProgress ++
        trace(`preload ${this.preloadProgress}/${this.preloadTotal}`)
        this.progress(this.preloadProgress, this.preloadTotal)
        cb(res)
    }, 3)

    preloadHash = {}

    preloadCtx = {
        preload: true,
        preloader: (url, type, priority=1000)=>{
            let prom = this.preloadHash[url]
            if(!__.ud(prom)){
                return prom
            }

            // trace('adding prelo', url, priority);

            const f = (()=>{
                switch(type){
                    case 'video':
                        return ()=>loadVideo(url)
                    case 'image':
                        return ()=>loadImage(url)
                    case 'json':
                        return ()=>loadJson(url)
                    default:
                        return ()=>warn('unknown preload request', type, url)
                }
            })()
            prom = new Promise(resolve=>this.queue.push(f, priority, res=>{ this.preloadHash[url] = true; return resolve(res) }))

            this.preloadHash[url] = prom
            this.preloadTotal = (this.preloadTotal||0) + 1
            return prom
        },
        isLoaded: url=>this.preloadHash[url] === true,
    }

    context = ()=>this.preloadCtx
}
