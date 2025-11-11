import React, { Component } from 'react'
import './video.styl'
import _ from 'lodash'

import videojs from 'video.js'
import 'video.js/dist/video-js.css'
import { requestUrl } from '@ips/app/resource.js'

import PropTypes from 'prop-types';
import { addComputedProps } from '../utils/computed-props'


const reloadPlayer = (player, start)=>{
    return new Promise((resolve, reject)=>{
        player.pause()
        player.currentTime(0);
        player.load();
        player.one('canplay', 
            start ? ()=>{
                    player.play()
                    resolve()
                } : 
                resolve
        )
        // if(start)
        //     player.play()
    })
}

const startPlayer = (player)=>{
    player.play()
}

const srcUrl = v => v ? requestUrl(v + '.mp4', 'video') : undefined
const posterUrl = v => v ? requestUrl(v + '.jpg', 'video') : undefined

const defaultCfg = {
    controls: false,
    autoplay: true,
    preload: 'auto',
    height: '100%',
    loop: true,
    fluid: true,
    children: [],
}

export class Video extends Component {

    constructor(){
        super()
        this.refLooper = React.createRef()
    }

    componentDidMount(){
        return
        this.looper = videojs(this.refLooper, defaultCfg)
        // this.looper.el_.style.cssText = this.get().calcStyle
        this.restart()
    }

    restart(instant = false){
        const { src } = this.props
        this.looper.src(srcUrl(src))
        this.looper.poster(posterUrl(src))
        reloadPlayer(this.looper, true)
    }

    render(){
        //<video className="video-js" muted playsInline loop autoPlay ref={ ref => this.refLooper = ref } src={ srcUrl(src) } poster={ posterUrl(src) }></video>

        const { src } = this.props
        return <div className={ `videon ${ this.props.className||'' }` }>
                    <video muted playsInline loop autoPlay ref={ ref => this.refLooper = ref } src={ srcUrl(src) } poster={ posterUrl(src) }></video>
                </div>
    }

}

Video.displayName = 'Video'

Video.propTypes = {
    style: PropTypes.object,
    className: PropTypes.string,
    // align: PropTypes.string,
    scale: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
}

Video.defaultProps = {
    style: {},
    className: null,
    // align: '',
    scale: null,
}


const computedProps=(props)=>{
    const { scale } = props;

    return {
        calcStyle: `${ 'undefined' == typeof scale ? '' : `transform:scale(${ scale });` }`
    }
}

export default addComputedProps(computedProps)(Video)
