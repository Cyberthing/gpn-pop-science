import imageUndefined64 from './image-undefined'
import _ from 'lodash'

let NOT_LOADED = 'not loaded'
let LOADING = 'loading'
let LOADED = 'loaded'

export class ResourceLoader{
    
    constructor(){
        this._resources = {};
        this._progress = 0;
        this.q = []
        this.cache = {}

        // this.publicPath = app.location.publicPath;
         // ? 
         //    location.protocol + '//' + app.location.publicPath.substr(app.location.publicPath.indexOf('://')+3)
         //    :''
    }

    loadImage(url, priority = 0, cb){
        if(!url || url == '' || !_.isString(url)){
            if(cb)
                cb(url, imageUndefined64)
            return;
        }

        if(this.cache[url]){
            // trace('ResourceLoader.loadImage - cached', url)

            let c = this.cache[url];

            if(c.state === LOADED)
                if(cb)
                    cb(url, c.rurl)

            if(c.priority > priority) // rise priority if needed
                c.priority = priority

            if(cb)
                c.cbs.push(cb)

            // TODO: update queue
            return;
        }

        // let rurl = app.location.publicPath + url
        let rurl = url

        let query = {
            type: 'image', 
            id: this.q.length, 
            state: NOT_LOADED, 
            cbs: (cb?[cb]:[]),
            url,
            rurl,
            priority, 
        }

        // trace('ResourceLoader.loadImage', this.q.length, url, rurl, priority)
        this.q.push(query);
        this.cache[url] = query;
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
            // trace(this._onFinish)

            // needed cuz in can be overwritten right in this routine
            const onFinish = this._onFinish
            this._onFinish = null
            onFinish()
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
        this.q = _.orderBy(this.q, ['priority', 'id'], ['asc', 'asc'])
        // trace('starting resource load with q', this.q)

        this._run();
    }

    _run(loader){
        // trace('_run', this)
        // let count = _.reduce(this.q, (acc, r)=>{ if(r.state == 'loaded') acc++; return acc; }, 0);
        // if(count == this.q.length)
        //     return;

        let next = _.find(this.q, q => q.state === NOT_LOADED )
        if(!next){
            let ing = _.find(this.q,  q => q.state === LOADING )
            if(!ing)
                this.finish()
            // trace('finish')
            return;
        }

        if(!loader)
            loader = _.find(this.loaders, (l)=>{ return !l.src || l.src == '' });
        // trace('loader', loader)
        if(!loader) return;

        next.state = LOADING;

        let doit = 
            Modernizr['browser-ie'] ?
                (evt)=>{ 
                    // if(evt.type == 'error'){
                    //     if(loader.src)
                    //         error(`cant load ${loader.src}`, evt)
                    //     return;  
                    // }

                    next.state = LOADED;

                    //  TODO: fix this check for IE/svg case - naturalWidth is zero at the first moment
                    // if(!loader.naturalWidth) // error
                    //     next.rurl = imageUndefined64;

                    // trace('loaded', evt, next.url, loader.width, loader.height, next.rurl)
                    // this._loaded(next.url);
                    _.each(next.cbs, cb=>cb(next.url, next.rurl))
                    next.cbs = []

                    // loader.src = '';
                    this._run(loader)
                }
            :
                (evt)=>{ 
                    if(evt.type == 'error'){
                        if(loader.src)
                            error(`cant load ${loader.src}`, evt)
                        return;  
                    }

                    next.state = LOADED;

                    if(!loader.naturalWidth) // error
                        next.rurl = imageUndefined64;

                    // trace('loaded', evt, next.url, loader.width, loader.height, next.rurl)
                    // this._loaded(next.url);
                    _.each(next.cbs, cb=>cb(next.url, next.rurl))
                    next.cbs = []

                    // loader.src = '';
                    this._run(loader)
                }

        loader.onload = doit;
        loader.onerror = doit;

        // trace('starting loader', next.rurl)
        loader.src = next.rurl;

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

export const resourceLoader = new ResourceLoader()
