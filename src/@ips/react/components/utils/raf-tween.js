import sob from '../lib/sob'
import EventPipe from '@ips/app/event-pipe'
import _ from 'lodash'

export var TWEEN = require('../lib/tween')

import { registerExpr } from './expr'

const filterArr = (arr, ignore)=>arr.filter((a, i)=>!ignore.includes(i))
const isZipEqual = (ig) => ig.map(z => z[0]==z[1]).reduce((a, v) => a&&v, true)

const mapLeafProps = (obj, path='', to = {})=>{
    _.each(obj, (p, i)=>{
        const ppath = path+i
        if(Object.keys(p).length){
            mapLeafProps(p, ppath+'.', to)
        }else
            to[ppath] = p
    })
    return to
}

// + create EasingMap automatically by traversing TWEEN.Easing
const EasingMap = mapLeafProps(TWEEN.Easing)
EasingMap['Linear'] = TWEEN.Easing.Linear.None
trace('EasingMap', EasingMap)

registerExpr('tween', pipe =>{
    // trace('calling tween fac')
    let state = []
    let tw = null;
    return args => {
        // trace('calling tween', args)

        const [ current, target, time, easing, ignore ] = args
        // trace('sss', current == state[0], target == state[1], time == state[2], easing == state[3], ignore)
        // trace('calling tween', current, target, time, easing, EasingMap[easing], ignore)

        // const fargs = [target, time, easing]
        // const ignars = _.zip(state, fargs)
        const ignars = filterArr(_.zip(state, args), ignore)
        // trace('ignars', ignars, ignore)
        if(!isZipEqual(ignars)){

            // trace('restart tween from', current)
            if(tw)
                tw.destroy()

            tw = tween({
                from:current,
                to:target,
                time:time,
                easing:EasingMap[easing],
                // update:(from, pos)=> {trace('tween upda', pos); pipe(pos) }
                update:(from, pos)=> pipe(from)
            })

            state = _.clone(args)
        }

        return ()=>{}
    }
})

const rafUpdate = ()=>{
    TWEEN.update()
    requestAnimationFrame(rafUpdate)
}
requestAnimationFrame(rafUpdate)

// const rafUpdate = ()=>{
//     TWEEN.update()
//     sob.frame(rafUpdate)
// }
// sob.frame(rafUpdate)


const defaultOpts = {
    // from: { },
    // to: { }
    time:1,
    easing: TWEEN.Easing.Circular.Out,  
    update: ()=>{},
    stop: (from, to, pos)=> from == to,
    end: ()=>{},
}

const needCon = v => !_.isObject(v) && !_.isArray(v)

TWEEN.Tween.prototype.destroy = function(){ 
    TWEEN.remove(this)
}

const ud = p => 'undefined' === typeof p
const udd = (p, d)=> 'undefined' === typeof p ? d:p

export function tween(opts){

    let { from, to, time, easing, update, stop, end } = { ...defaultOpts, ...opts }
    from = udd(from, 0)
    to = udd(to, 0)
    time = udd(time, 1)
    easing = udd(easing, TWEEN.Easing.Linear.None)

    let pipe = null
    let inito = null
    if(_.isString(to) && to.startsWith('eventPipe')){
        pipe = EventPipe.parse(to)
        inito = from
    }else
        inito = to

    const fromCon = needCon(from) ? { from } : from
    const toCon = needCon(to) ? { from:to } : to


    const onUpdate = 
        needCon(from) ?  
            pos => {  // NOTE: use a 'function(pos) to access all the object through 'this'
                update(fromCon.from, pos)
                if(stop(fromCon.from, toCon.from, pos)){
                    TWEEN.remove(_tween)
                    _tween = null
                    end()
                }
            }
        :
            pos => {  // NOTE: use a 'function(pos) to access all the object through 'this'
                update(fromCon, pos)
                if(stop(fromCon, toCon, pos)){
                    TWEEN.remove(_tween)
                    _tween = null
                    end()
                }
            }

    var _tween = new TWEEN.Tween(fromCon)
    _tween
        .to(toCon, time*1000)
        .easing(easing) // Use an easing function to make the animation smooth.
        .onUpdate(onUpdate)
        .start(); // Start the tween immediately.

    if(pipe)
        pipe.on('update', v => _tween.to(v, time*1000))

        // if( this._done || ccounter.current == target) return

    return _tween
}

function parseParams(s){
    if(s.startsWith('tween')){
        const brax = /\(([^)]+)\)/
        s = _.map(s.match(brax)[1].split(','), s => s.trim())
        const [ to, time, easing ] = s

        return {
            target: target.startsWith('eventPipe') ? EventPipe.parse(target) : target, 
            time,
            easing }
        // return new EventPipe(...s)
    }
}

export var Easing = TWEEN.Easing

// export 
// module.exports = {
//     TWEEN,
//     tween,
//     Easing:TWEEN.Easing
// }
