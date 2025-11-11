// TODO


import __ from './hidash'
import _ from './lodash'

let NOT_LOADED = 'not loaded'
let LOADING = 'loading'
let LOADED = 'loaded'

export class ResourceLoader{
    
    constructor(){
        this._resources = {};
        this._progress = 0;
        this.q = []
    }

    loadImage(url, priority = 0, cb){
        if(!url || url == '' || !__.isString(url)){
            if(cb)
                cb()
            return;
        }

        let elt = {type:'image', id:this.q.length, state:NOT_LOADED, url, priority, cb}
        // trace('ResourceLoader.loadImage', this.q.length, url, priority)
        this.q.push(elt);
    }

    loadVideo(url, priority){

    }

    progress(){
        return this._progress;
    }

    onProgress(f){
        this._onProgress = f;
    }

    finish(){
        if(this._onFinish){
            this._onFinish()
            this._onFinish = null;
        }

        if(this.maxTimeOut){
            clearTimeout(this.maxTimeOut)
            this.maxTimeOut = null
        }
    }

    onFinish(f, ifempty = false, maxTime = -1){
        this._onFinish = f;

        if(ifempty && !this._resources.length)
            f();

        if(maxTime >= 0)
            this.maxTimeOut = setTimeout(()=>{ this.finish() }, maxTime * 1000)
    }

    start(){
        const NUM_STREAMS = 6;
        this.loaders = Array.apply(null, Array(NUM_STREAMS)).map(()=>{ return new Image() });
        // trace('loaders', this.loaders)
        this.q = _.orderBy(this.q, ['priority', 'id'], ['desc', 'asc'])
        // trace('starting resource load with q', this.q)

        this._run();
    }

    _run(loader){
        // trace('_run', this)
        // let count = _.reduce(this.q, (acc, r)=>{ if(r.state == 'loaded') acc++; return acc; }, 0);
        // if(count == this.q.length)
        //     return;

        let next = this.q.find( q => q.state === NOT_LOADED )
        if(!next){
            let ing = _.find(this.q,  q => q.state === LOADING )
            if(!ing)
                this.finish()
            return;
        }

        if(!loader)
            loader = _.find(this.loaders, (l)=>{ return !l.src || l.src == '' });
        if(!loader) return;

        next.state = LOADING;
        loader.onload = ()=>{ 
            next.state = LOADED;
            loader.src = '';
            // this._loaded(next.url);
            if(next.cb)
                next.cb(next.url)

            this._run(loader)
        }
        loader.src = next.url;

        this._run()
    }

    _added(what){
        this._resources[what] = false;
    }

    // _loaded(what){
    //     this._resources[what] = true;
    //     var count = _.reduce(this._resources, (acc, r)=>{ if(r) acc++; return acc; }, 0);
    //     this._progress = count/_.size(this._resources);
    //     if(this._onProgress)
    //         this._onProgress(this._progress);
    //     if(this._onFinish && this._progress == 1)
    //         this._onFinish()
    // }

}
