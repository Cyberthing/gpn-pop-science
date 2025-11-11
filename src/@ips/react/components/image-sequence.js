import React, { Fragment } from 'react';
import _ from 'lodash'

import Base from './base'
import PropTypes from 'prop-types';
import { requestUrl } from '@ips/app/resource'
// import { loadImages } from '@ips/app/dom-utils'
import { parseParams } from '@ips/app/parse-params'
import EventPipe from '@ips/app/event-pipe'
import Tween from './utils/raf-tween'
import { isExpr, compileExpr, Context } from './utils/expr'

import './image-sequence.styl'

import { ResourceLoader } from './resource-loader'

import sob from './lib/sob'

// some weird IE flicker fix
// try {
//     document.execCommand('BackgroundImageCache', false, true);
// }
// catch(e) {};

// +++++ TRY WITH CANVAS FOR IE

const fixExt = (s, p='') => { let ss = s.split('.'); if (ss.length < 2) ss.push('jpg'); return ss[0] + p + '.' + ss[1] }

const ud = (e) => 'undefined' === typeof e

const preloadImages = (imgs)=>{
    _.each(imgs, i=>{
        const link = document.createElement('link')
        link.rel = 'preload'
        link.setAttribute('as', 'image')
        link.href = i

        document.head.appendChild(link)
    })
}


const loadImages = (imgs, cb) => {
    if(Modernizr && Modernizr['browser-ie']){
        cb()
        return
    }

    let count = imgs.length

    _.each(imgs, c => {
        const doload = ()=>{ 
            count--; 
            if(!count) 
                cb()
        }
        c.onload = doload
        c.onerror = doload
    })
}

export class ImageSequence extends Base{
    reloader = new ResourceLoader()

    recalc(props, state, force){

        let cprops = super.recalc(props, state, force)

        // trace('recalc imagese')
        const { images, path, thumbs, poster, className, mode } = props
        const { loaded, current, tpl } = state
        //trace('images', images, this.props.images)

        const urlopts = {}
        if(path){
            urlopts.path = path
            // if(path[path.length - 1] != '/')
                // urlopts.path += '/'
        }

        const rmode = Modernizr['browser-ie'] ? 'canvas' : mode
        // const rmode = 'canvas'

        cprops.className = `image-sequence image-sequence_${ rmode } ${ className || '' }`

        if(this.props.images != images || force){
            cprops.imageUrls = _.map(parseParams(images), s=> requestUrl(fixExt(s), 'image', urlopts))

            if(thumbs)
                cprops.thumbUrls = _.map(parseParams(images), s=> requestUrl(fixExt(s, '-0x'), 'image', urlopts))

            if(poster)
                cprops.posterUrl = requestUrl(fixExt(poster), 'image', urlopts)
        }


        return cprops
    }

    created(){
        trace('ImageSequence', this)

        const { current, autoplay, speed, loop, thumbs, poster, mode } = this.props
        const { thumbUrls, imageUrls } = this.cprops
        // const { loaded } = this.state

        let initial = 0;

        this.renderExpr('current', current, v=>this.setState({ current: v|0 }))

        if(current.startsWith('eventPipe')){
            const pipe = EventPipe.parse(current)
            pipe.on('update', v=>this.setState({ current:v|0 }))
        }else
            initial = +current || 0

        // if(poster)
        //     this.setState({ loadingState: 'poster' })
        // else
        // if(thumbs)
        //     this.setState({ loadingState: 'thumbs' })
        // else
            this.setState({ loadingState: 'images' })

        this.setState({ rendered:false, current:initial })

        if(!ud(autoplay) && autoplay){
            this.play(!ud(loop), speed)
        }

        if(mode == 'canvas'){
            window.addEventListener('resize', this.onResizeCanvas)            
        }
    }

    onResizeCanvas = _.throttle(()=>{
        if(!this.$canvas || !this.$el) return
 
        this.$canvas.setAttribute('width', this.$canvas.offsetWidth)
        this.$canvas.setAttribute('height', this.$canvas.offsetHeight)

        const i = this.$el.children[0]
        const a1 = i.width / i.height
        // trace('a1', a1, i.width, i.height)
        const a2 = this.$canvas.offsetWidth / this.$canvas.offsetHeight

        //trace(i, a1, a2, this.$canvas.offsetWidth, i.width, this.$canvas.offsetHeight, i.height)
        if(a1 > a2){
            //trace('v1')
            this.blaw = this.$canvas.offsetHeight * a1
            this.blax = -Math.abs(this.$canvas.offsetWidth - this.blaw)/2
            this.blay = 0
            this.blah = this.$canvas.offsetHeight
        }else{
            //trace('v2')
            this.blax = 0
            this.blah = this.$canvas.offsetWidth / a1
            this.blay = -Math.abs(this.$canvas.offsetHeight - this.blah)/2
            this.blaw = this.$canvas.offsetWidth
        }

        this.setCur()
    }, 200)

    tplModeCanvas(){
        //const { imageUrls } = this.cprops
        return null
                //<div ref={ ref=> this.$el = ref } className="rendify" style={{ display:'none' }}>
                //    { _.map(imageUrls, (src, i)=>  <img key={ i } src={ src }/> ) }
                //</div>
    }

    tplModeImg(){
        const { imageUrls } = this.cprops
        return  (
            <div ref={ ref=> this.$el = ref }>
                { _.map(imageUrls, (src, i)=>  <div key={ i }>
                                                <img src={ src }/> 
                                            </div>) 
                }
            </div>
        )
    }

    tplModeBkg(){
        const { imageUrls } = this.cprops
        return (
            <div ref={ ref=> this.$el = ref }>
                { _.map(imageUrls, (src, i)=>  <div key={ i } style={{ backgroundImage:`url(${ src })` }} />) }
            </div>
        )
    }

    drop(img){

        // const c = this.$canvas
        // const ctx = c.getContext('2d')
        try{
            // trace(i.width, i.height, c.width, c.height)
            this.ctx.drawImage(img, this.blax, this.blay, this.blaw, this.blah)
            // trace('rendered succ')

        }catch(err){
            // this.$el.children[0]
            error(err)
        }
    }
    
    setCur(){
        // trace('setCur', current, this.$el.children[current])
        // const { mode } = this.props
        // if(mode == 'canvas'){
            const { current, rendered } = this.state
            // trace('setCur', this.$canvas, this.$el, current)

            if(this.$canvas && this.$el){
                requestAnimationFrame(()=>{
                    this.drop(this.$el.children[current])
                    if(!rendered){
                        this.setState({rendered:true})
                    }
                })
            }
        // }
        // else

        // if(this.$el){
        //     const { current } = this.state

        //     // trace('dropdrop')

        //     // // method1
        //     _.each(this.$el.children, e=>e.classList.remove('current'))
        //     this.$el.children[current] && this.$el.children[current].classList.add('current')

        //     // method2
        //     // _.each(this.$el.children, (e, i)=>e.classList.toggle('current', i <= current ))
        //     // _.each(this.$el.children, (e, i)=>e.className = i <= current ? 'current' : '' )
        // }        
    }

    willUpdate(props, state, ctx){
        this.cprops = this.recalc(props, state, false, ctx)        
    }

    updated(){
        const { mode } = this.props
        const { loadingState } = this.state
        const { thumbUrls, imageUrls } = this.cprops

        // trace('updated', loadingState)
        // if(loadingState == 'thumbs'){
        //     trace('loading thumbs')
        //     this.setState({ loadingState:'loading thumbs' }) 

        //     _.each(thumbUrls, src => this.reloader.loadImage(src))
        //     this.reloader.onFinish(()=>{
        //         trace('thumbs arrite')

        //         const tpl = <ol ref={ ref=> this.$el = ref }>
        //                         { _.map(thumbUrls, (src, i)=>  <li key={ i }>
        //                                                         <img src={ src }/> 
        //                                                     </li>) 
        //                         }
        //                          </ol>

        //         // trace('making thumb tpl', tpl)

        //         this.setState({ loadingState:'images', tpl }) 
        //     })
        //     this.reloader.start()
        // }else

        if(this.$canvas && !this.ctx)
            this.ctx = this.$canvas.getContext('2d')

        if(loadingState == 'images'){
            this.setState({ loadingState:'loading images' }) 
            trace('loading images', this.$el)

            _.each(imageUrls, (src, i) => this.reloader.loadImage(src,0,()=>this.drop(this.$el.children[i])))
            this.reloader.onFinish(()=>{
                trace('states arrite')
                this.onResizeCanvas()

                const tpl = 
                    (Modernizr['browser-ie']||mode=='canvas') ? 
                        this.tplModeCanvas()
                    :( mode == 'background' ? 
                        this.tplModeBkg()
                        :
                        this.tplModeImg()
                    )
                    

                const rendify = Modernizr['browser-firefox'] || Modernizr['platform-ios'] ? imageUrls : []

                this.setState({ loadingState:'', tpl, rendify }) 
            })
            this.reloader.start()

        }

        this.setCur()

        if(mode == 'canvas'){
            const { loadingState } = this.state
            // if(loadingState === '')
                // this.onResizeCanvas()
        }
    }

    play(loop, speed){

        let curTime = Date.now()
        const player = ()=>{
            if(this.$el){

                let ntime = Date.now()
                const curf = (((ntime-curTime)/1000 * speed)|0)%this.cprops.imageUrls.length

                // trace('running player', curf)

                _.each(this.$el.children, (e, i)=>e.classList.toggle('current', curf == i))
                // _.each(this.$el.children, (e, i)=>e.classList.remove('current'))
                // this.$el.children[curf].classList.add('current')            
            }

            sob.frame(player)
        }
        sob.frame(player)
    }

    render(){
        const { mode, poster } = this.props
        const { imageUrls, thumbUrls, className, posterUrl } = this.cprops

        // if(mode == 'canvas'){
            // const { className,  } = this.cprops
            const { tpl, loadingState, rendered } = this.state

            // trace('render', tpl, this)

            return <div className={`${className} ls-${loadingState} ${rendered?'rendered':''}`}>
                        { (poster) ?  <div className="poster" style={{backgroundImage:`url(${posterUrl})`}}/> : null }
                        <Fragment>
                            <canvas ref={ ref=> this.$canvas = ref }/>,
                            <div ref={ ref=> this.$el = ref } className="rendify" style={{ display:'none' }}>
                                { _.map(imageUrls, (src, i)=>  <img key={ i } src={ src }/> ) }
                            </div>
                        </Fragment>
                    </div>            
        // }

        // // trace('ImageSequence render', this)
        // const { loadingState, current, tpl, rendify } = this.state

        // return  <div className={ className }>
        //             { tpl }
        //             <div className="rendify" style={{ display:'none' }}>{ _.map(rendify, r => <img src={ r } />) }</div>
        //         </div>
    }

}

if(Modernizr['browser-ie'])
{
    ImageSequence.prototype.render = function(){
        const { className } = this.cprops
        const { tpl } = this.state

        return <div className={ className }>
                    <canvas ref={ ref=> this.$canvas = ref }/>
                    { tpl }
                </div>
    }

    const crea = ImageSequence.prototype.created
    ImageSequence.prototype.created = function(){
        // trace('nucrea')
        crea.call(this)

        this.onResizeCanvas()
        window.addEventListener('resize', this.onResizeCanvas)
    }

    const gergalon = ImageSequence.prototype.updated
    ImageSequence.prototype.updated = function(){
        gergalon.call(this)

        const { loadingState } = this.state
        if(loadingState === '')
            this.onResizeCanvas()
    }    

    ImageSequence.prototype.setCur = function(){
        const { current } = this.state

        if(this.$canvas && this.$el){
            // trace('setCur', current, this.$el.children[current])
            const c = this.$canvas
            // const ctx = c.getContext('2d')
            try{
                const i = this.$el.children[current]
                // trace(i.width, i.height, c.width, c.height)
                ctx.drawImage(i, this.blax, this.blay, this.blaw, this.blah)

            }catch(err){
                // this.$el.children[0]
                error(err)
            }

        }
    }
}

// <ImageSequence images="334,453,3543"/>

ImageSequence.propTypes = {
    style: PropTypes.object,
    className: PropTypes.string,
    images: PropTypes.string,
    current: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    autoplay:PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
    loop:PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
    speed: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    mode: PropTypes.string // either 'img' or 'background'
}

ImageSequence.defaultProps = {
    style: {},
    className: null,
    images: '',
    current: '',
    autoplay:false,
    loop:true,
    speed:30,
    mode:'img'
}


// export default ImageSequence = Modernizr['browser-ie'] ? ImageSequenceCanvas : ImageSequence

export default ImageSequence
