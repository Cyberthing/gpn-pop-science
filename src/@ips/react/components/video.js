import React, { Component } from 'react'
import Base from './base'
import './video.styl'

import { requestUrl } from '@ips/app/resource.js'

import PropTypes from 'prop-types';

// const reloadPlayer = (player, start)=>{
//     return new Promise((resolve, reject)=>{
//         player.pause()
//         player.currentTime(0);
//         player.load();
//         player.one('canplay', 
//             start ? ()=>{
//                     player.play()
//                     resolve()
//                 } : 
//                 resolve
//         )
//         // if(start)
//         //     player.play()
//     })
// }

// const startPlayer = (player)=>{
//     player.play()
// }

const srcUrl = v => v ? (v + '.mp4') : undefined
const posterUrl = v => v ? (v + '.jpg') : undefined
const posterFromSrc = v => v ? (v.split('.').slice(0, -1).join('.') + '.jpg') : undefined

export class Video extends Base {

    videoRef = React.createRef()

    recalc(props, state, force){
        const { className, srcId, src, poster } = props;

        let cprops = super.recalc(props, state, force)

        // trace('cprops', props)

        return {
            ...cprops, 
            ...{
                src: requestUrl(src ? src : srcUrl(srcId), 'video'),
                poster: requestUrl(poster ? poster : (src ? posterFromSrc(src) : posterUrl(srcId)), 'video'),
            }}
    }

    render(){
        const { mode, controls, autoPlay, muted } = this.props
        const { src, poster } = this.cprops

        const p = this.props
        const s = this.state

        // trace('video render', src, poster, this.cprops)

        if(mode == 'backLoop')
            return <video className={`video ${ s.className||p.className||'' }`} muted playsInline loop autoPlay ref={ this.videoRef } src={ src } poster={ poster }></video>

        return <video autoPlay={autoPlay||false} className={`video ${ s.className||p.className||'' }`} muted={ muted&&true } controls={ controls } playsInline ref={ this.videoRef } src={ src } poster={ poster }></video>
    }

    async created(){
        // trace('video', this)

        super.created()

        const { cover, playing, currentTime } = this.props

        const $el = this.videoRef.current

        if(cover){
            $el.addEventListener('loadedmetadata', (e)=>{
                // trace('video loaded', this, this.$el.videoWidth, this.$el.videoHeight, this.$el.videoWidth/this.$el.videoHeight)
                this.setState({ aspect: $el.videoWidth/$el.videoHeight })

                // creating unique rule
            })
        }

        this.renderExpr('playing', playing, v=>this.setState({ playing: v }))

        this.renderExpr('currentTime', currentTime, currentTime=>{
            trace('setting currentTime', currentTime)
            $el.currentTime = _.isNumber(currentTime) ? currentTime : 0
        })

        

        //this.$el.setAttribute('muted', 'muted')

        if(Modernizr['platform-android'])
            document.body.addEventListener("click", function() {
                if ($el.paused) { $el.play(); }
                else { $el.pause(); }
            })

        $el.addEventListener('ended', ()=>this.ee.fire('finish'))

        //this.$el

        // this.updateInstance()
    }

    willUpdate(props, state, ctx){
        this.cprops = this.recalc(props, state, false, ctx)
    }

    updated(){
        const $el = this.videoRef.current;
        // trace('video.updated', this.props, this.state, $el.readyState)
        if(!$el || $el.readyState != 4)
            return;

        if(this.state.playing && $el.paused)
            $el.play()
        else
        if(!this.state.playing && !$el.paused)
            $el.pause()

    }

}
//mute="mute" muted="muted"  playsInline loop autobuffer="autobuffer" autoPlay 

// Video.displayName = 'Video'

// Video.propTypes = {
//     style: PropTypes.object,
//     className: PropTypes.string,
//     // align: PropTypes.string,
//     scale: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
// }

// Video.defaultProps = {
//     style: {},
//     className: null,
//     // align: '',
//     scale: null,
// }


// const computedProps=(props)=>{
//     const { scale } = props;

//     return {
//         calcStyle: `${ 'undefined' == typeof scale ? '' : `transform:scale(${ scale });` }`
//     }
// }

//     <Video className="blackwater" id="video1" srcId="bw" backLoop cover/>

export default Video