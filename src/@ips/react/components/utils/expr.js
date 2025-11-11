import * as __ from '@ips/app/hidash'
import jsep from '../lib/jsep'

import * as appreg from '@ips/app/app-registry'

// import R from 'ramda'
// // trace('jsep', jsep)
//     return R.not()
// case '+':
//     return v => +v
// case '-':
//     return R.negate()

// trace('jsep', jsep)

const ud = p => 'undefined' === typeof p

const ExprStart = 'expr '

export const isExpr = s => __.isString(s) && s.startsWith(ExprStart)

export const parseExpr = s => {
    if(!isExpr(s)){
        warn(`Expr: '${ s }' doesn't seem like an expr. It should be a string and start with '${ ExprStart }'` )
        return
    }

    const t = jsep(s.substr(ExprStart.length))
    return t
}

const registry = { }

export const registerExpr = (name, f)=>{
    registry[name] = f
}

registerExpr('log', pipe=> args => trace(...__.map(args, a => a)))
registerExpr('at', pipe=> {
    //trace('at init')

    return async args=>{
        const [arr, index] = args
        //trace('at', arr, index)
        return pipe(arr[index])
    }
})
registerExpr('max', pipe=> {
    return async args=>{
        const [arr] = args
        // trace('max', arr)
        return pipe(Math.max(...arr))
    }
})
registerExpr('min', pipe=> {
    return async args=>{
        const [arr] = args
        //trace('min', arr)
        return pipe(Math.min(...arr))
    }
})
registerExpr('floor', pipe=> {
    return async args=>{
        const [v] = args
        // trace('floor', v)
        return pipe(Math.floor(v))
    }
})
registerExpr('ceil', pipe=> {
    return async args=>{
        const [v] = args
        // trace('ceil', v)
        return pipe(Math.ceil(v))
    }
})

registerExpr('event', pipe=> {
    // trace('epipe init')

    return async args=>{
        const [name, event, param] = args
        // trace('epipe', name, event, param)
        const r = await appreg.request([name])
        // trace('got r', r); 
        r[name].ee.on(event, e => {
            // trace('gotda', e)
            pipe(ud(param) ? (!ud(e) ? e : true) : e[param])
        })
        // r[name].ee.on(event, e =>{ trace('e', e, param); return pipe(e[param]) })
 
        return ()=>{}
    }
})
registerExpr('snapshot', pipe=> {

    let state = []
    let interval = null

    return args=>{

        // trace('updatng snapshot', args)
        const [ val, time, repeat ] = args
        const [ sval, stime, srepeat ] = state

        if(time != stime){
            clearInterval(interval)
            interval = null
        }

        if(!interval){
            trace('setting timer snapshot', stime, time)

            let rep = repeat;

            interval = setInterval(()=>{
                trace('checkin')
                const [ val, time, repeat ] = args

                if(sval != val){
                    trace('runnin snapshot', val)
                    pipe(val)
                }
                state = {...args}

                if(rep > 0){
                    rep --
                    trace('repeat countdown', rep)
                    if(!rep){
                        trace('repeat is done')
                        clearInterval(interval)
                        interval = null
                    }
                }
            }, (time*1000)|0)
        }

        return ()=> state
    }
})

class Downpipe{
    say = ()=>{}

    listen(cb){
        this.say = cb
    }
}

class Multipipe extends Downpipe{
    cbs = []

    listen(cb){
        this.cbs.push(cb)
    }

    say = v => __.each(this.cbs, cb=>cb(v))
}


const semaphorLoop = (semaphor, f)=>{

    // this timeframe break is needed to avoid critical races
    const af = ()=>setTimeout(f, 0)

    const run = ()=>new Promise((resolve, reject)=>{
        semaphor.resolve = resolve
    }).then(af).then(run)

    run()
}

const semaphorLoopBreakable = (semaphor, f)=>{

    // this timeframe break is needed to avoid critical races
    const af = ()=>setTimeout(f, 0)

    const run = ()=>{
        if(semaphor.break)
            return

        return new Promise((resolve, reject)=>{
            semaphor.resolve = resolve
        }).then(af).then(run)
    }

    run()
}

function collect(ins, out){
    if(!ins || !ins.length) return

    const l = {
        ins,
        // out,
        cache: Array(ins.length).fill(0),
        semaphor: { resolve: ()=>{} }
    }

    // trace('collect', ins)

    // ===== semaphor version
    __.each(ins, (a, i)=> {
        l.cache[i] = a.v
        a.listen( v=> { l.cache[i] = v; l.semaphor.resolve() } )
    })
    semaphorLoop( l.semaphor, out.bind(this, l.cache))

    // // ===== straight version
    // _.each(ins, (a, i)=> {
    //     l.cache[i] = a.v
    //     a.listen( v=> { l.cache[i] = v; outpipe(l.cache) } )
    // })

    return l
}

class Expr extends Downpipe{
    f = ()=>null

    constructor(ff, args){
        super()

        // trace('Expr', this)
        
        this.f = ff(v => {
            this.v = v
            this.say(v)
            //trace('say', v)
        })

        this.l = collect.call(this, args, this.f)

        this.f(__.map(args, a => a.v))
    }

    destroy(){
        // TODO
    }
}

const instantPipe = f => pipe => args =>pipe(f(args))

const tagLiteral = v => new Expr(instantPipe(()=>v))

const tagUnary = (ctx, name, arg)=>{
    const Unops = {
        '!': v => !v[0],
        '+': v => +v[0],
        '-': v => -v[0],
        '~': v => ~v[0],
    }

    if(!Unops.hasOwnProperty(name)){
        warn(`Expr: unknown unary operator '${ name }'`)
        return 
    }

    return new Expr(instantPipe(Unops[name]), [tag(ctx, arg)])
}

const tagBinary = (ctx, name, args)=>{
    const Binops = {
        '+': v => v[0]+v[1],
        '-': v => v[0]-v[1],
        '/': v => v[0]/v[1],
        '*': v => v[0]*v[1],
        '%': v => v[0]%v[1],
        '|': v => v[0]|v[1],
        '==': v => v[0]==v[1],
        '&&': v => v[0]&&v[1],
        '||': v => v[0]||v[1],
        '<': v => v[0]<v[1],
        '>': v => v[0]>v[1],
        '<=': v => v[0]<=v[1],
        '>=': v => v[0]>=v[1],
        '<<': v => v[0]<<v[1],
        '>>': v => v[0]>>v[1],
    }

    if(!Binops.hasOwnProperty(name)){
        warn(`Expr: unknown binary operator '${ name }'`)
        return 
    }

    return new Expr(instantPipe(Binops[name]), __.map(args, a => tag(ctx, a)))
}


const tagCall = (ctx, name, args)=>{
    const f = registry[name]
    if(!f){
        warn(`Expr: unknown function '${ name }'`)
        return 
    }

    return new Expr(f, __.map(args, a => tag(ctx, a)))
}


const tagArray = (ctx, args)=>{
    // trace('tagArray', args)
    return new Expr(v=>v, __.map(args, a => tag(ctx, a)))
}

const tagIndentifier = (ctx, name)=> new Expr(pipe =>{
    ctx.listenProp(name, pipe)
    const v = ctx.findProp(name)
    pipe(v)
    trace('got Identifier', name, v, ctx)
    return ()=>v
})

const tagConditional = (ctx, args)=> new Expr(instantPipe(args=>{
    // trace('condee', args)
    const [ test, consequent, alternate ] = args
    //trace('cond', test ? consequent : alternate)
    return test ? consequent : alternate
}), __.map(args, a => tag(ctx, a)))


const tag = (ctx, e) => {
    // trace('tag', e)
    switch(e.type){
        case 'Compound':{
            return __.map(e.body, ee=>tag(ctx, ee))
        }
        case 'Literal':{
            return tagLiteral(e.value)
        }
        case 'Identifier':{
            return tagIndentifier(ctx, e.name)
        }
        case 'CallExpression':{
            return tagCall(ctx, e.callee.name, e.arguments)
        }
        case 'ArrayExpression':{
            return tagArray(ctx, e.elements)
        }
        case 'UnaryExpression':{
            return tagUnary(ctx, e.operator, e.argument)
        }
        case 'BinaryExpression':
        case 'LogicalExpression':{
            return tagBinary(ctx, e.operator, [e.left, e.right])
        }
        case 'ConditionalExpression':{
            return tagConditional(ctx, [e.test, e.consequent, e.alternate])
        }
        // TODO: 
        //   + ConditionalExpression( test ? consequent : alternate )
        //   + LogicalExpression
        //   + min([])/max([]) functions
        //   + at([], index) function

        //   - add chains using '.' (MemberExpression)
        //   - add variables( either set() or v=.. ) - Multipipes
    }
}

export class Context{
    l = {}

    constructor(props=[], parent){
        this.props = props;
        this.parent = parent
    }

    findProp(name){
        // trace('findProp', name, this)
        if(this.props.hasOwnProperty(name))
            return this.props[name]
        return this.parent && this.parent.findProp(name)
    }

    listenProp(name, cb){
        this.l[name] = this.l[name]||new Multipipe()
        this.l[name].listen(cb)
        // this.l[name].listen(v=>{ trace('got prop', v); cb(v) })
    }

    updateProp(name, val){
        this.l[name]&&this.l[name].say(val)
        this.props[name] = val
    }

    update(props){
        // trace('zcontext update', props)
        __.objEach(this.l, (p,l)=>( props[l] != this.props[l] && p.say(props[l]) ))
        this.props = props;
    }
}

const globalCtx = new Context(app.registry)
// const context = (props, parent)=>({ props, parent })

const cleanupExpr = s=>s.replace(/\n/g,' ')

export const compileExpr = (s, ctxprops) => {
    const e = parseExpr(cleanupExpr(s))
    //....

    if(!(ctxprops instanceof Context)) // if these are just props - wrap them to a context
        ctxprops = new Context(ctxprops)
    // trace('ctx', ctx)
    ctxprops.parent = globalCtx
    //Object.getPrototypeOf(ctx).constructor.name == 'Context'

    // trace('compileExpr', ctx, e)

    const expr = tag(ctxprops, e)
    expr.ctx = ctxprops

    return expr
}
