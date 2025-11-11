//import { windowSize } from '@ips/app/dom-utils'
// require('intersection-observer');

function destroy(){
    this.observer.disconnect()//.unobserve(this.el)
    this.observer = null;
}

const defaultOpts = {
    mode: 'toggle', // once|toggle|always (toggle is default)    
}

export function trackBox(el, cb = ()=>{}, opts = {}){

    // trace('trackBox', el)

    if(!el.tagName){
        warn('vistracker utils: object doesn\'t seem to be a HTMLElement', el)
        return
    }    

    const { mode, ratio=0 } = { ...defaultOpts, ...opts }

    var state = {
        el,
        cb,
        visible:false
    }

    const handleIntersect = 
        (mode == 'once' ? 
            inters =>{
                if(!state.visible && inters[0].intersectionRatio > ratio){
                    trace('goglgog')
                    state.visible = true
                    cb(true)
                }
            } : 
        (mode == 'toggle' ? 
            inters =>{
                try{
                // trace('inters[0].intersectionRatio', inters[0].intersectionRatio)
                const newvis = inters[0].intersectionRatio > ratio
                if(!state.visible){
                    if(newvis){
                        // trace('shmoshom', inters[0].intersectionRatio)
                        state.visible = true
                        cb(true)
                    }
                }else{
                    if(!newvis){
                        state.visible = false
                        cb(false)
                    }
                }
                }catch(err){
                    error(err)
                }
            }: 
        (mode == 'always' ? 
            inters => cb(inters[0].intersectionRatio > ratio)
                : 
            null
        )))

    let observerOptions = {
        root: null,
        //rootMargin: `${ 0 }px 0px ${ -700 }px 0px`,//(-300)+'px',//
        // threshold: .5//buildThresholdList()
    };

    //trace('opts', observerOptions)

    if(handleIntersect){
        state.observer = new IntersectionObserver(handleIntersect, observerOptions);
        state.observer.observe(el);

        state.destroy = destroy.bind(state)
    }else
        state.destroy = ()=>{}

    return state
}

export var trackPoint = trackBox

// export function trackPoint(
//     el, 
//     cb = ()=>{},
//     opts){

//     trace('trackPoint', el)

//     if(!el.tagName){
//         warn('vistracker utils: object doesn\'t seem to be a HTMLElement', el)
//         return
//     }    

//     const { mode } = { ...defaultOpts, ...opts }

//     var state = {
//         el,
//         cb,
//         visible:false
//     }

//     const handleIntersect = 
//         (mode == 'once' ? 
//             inters =>{
//                 if(!state.visible && inters[0].intersectionRatio > 0){
//                     state.visible = true
//                     cb()
//                 }
//             } : 
//         (mode == 'toggle' ? 
//             inters =>{
//                 const newvis = inters[0].intersectionRatio > 0
//                 if(!state.visible){
//                     if(newvis){
//                         state.visible = true
//                         cb(true)
//                     }
//                 }else{
//                     if(!newvis){
//                         state.visible = false
//                         cb(false)
//                     }
//                 }                
//             }: 
//         (mode == 'always' ? 
//             inters => cb(inters[0].intersectionRatio > 0)
//                 : 
//             null
//         )))

//     let observerOptions = {
//         root: null,
//         //rootMargin: `${ 0 }px 0px ${ -700 }px 0px`,//(-300)+'px',//
//         // threshold: .5//buildThresholdList()
//     };

//     //trace('opts', observerOptions)

//     if(handleIntersect){
//         state.observer = new IntersectionObserver(handleIntersect, observerOptions);
//         state.observer.observe(el);

//         state.destroy = destroy.bind(state)
//     }else
//         state.destroy = ()=>{}

//     return state
// }