import React, { useEffect, useRef, useState } from 'react';
// import { registerPlayerWebComponent, VideoFormat, VideoQuality } from '@vkontakte/videoplayer';
import { usePlayer } from './Player';
import createStaticEventTargetHook from '@/utils/eventTargetHook';
// registerPlayerWebComponent()

// const iframe = `<iframe src="https://vk.com/video_ext.php?oid=-33119141&id=456240032&js_api=1" width="640" height="360" allow="autoplay; encrypted-media; fullscreen; picture-in-picture;" frameborder="0" allowfullscreen></iframe>`
const useWindow = createStaticEventTargetHook(window);

const nop = ()=>{}

export const VKVideo = ({ src })=>{
    // const { onPlay=nop, onStop=nop } = useApp()
    const player = usePlayer()

    const ref = useRef()
    const refPlayer = useRef()
    const [w, setW] = useState()

    useWindow('resize', ()=>{
        // setW(ref.current.offsetWidth)
        // trace('useResize', ref.current.offsetWidth)
        // ref.current.style.setProperty('--playerw', ""+ref.current.offsetWidth)
        setW(ref.current.offsetWidth)
    },null, [])

    useEffect(()=>{

        setTimeout(()=>{
            setW(ref.current.offsetWidth)
        }, 500)
        // ref.current.style.setProperty('--playerw', ""+ref.current.offsetWidth)
        // ref.current.innerHTML = iframe
        const vkplayer = VK.VideoPlayer(refPlayer.current);
        // setPlayer(player)

        vkplayer.on('started', ()=>{
            trace('started')
            player.pause()
        })
        vkplayer.on('resumed', ()=>{
            trace('resumed')
            player.pause()
        })
        
        vkplayer.on('paused', ()=>{
            trace('paused')
            player.resumeOrPlay(-1)
        })
        vkplayer.on('ended', ()=>{
            trace('ended')
            player.resumeOrPlay(-1)
        })

        // ref.current.appendChild(player)
    },[])

    // return <VKVideoPlayer/>
    // return <div className="vkvideo" ref={ref}/>
    return <div ref={ref} className='vkplayer-cont'>
        <iframe ref={refPlayer} src={src} width={`${w}`} height={`${(w/640*360)|0}`} allow="autoplay; encrypted-media; fullscreen; picture-in-picture;" frameBorder="0" allowFullScreen></iframe>
    </div>
 }

 export default VKVideo
