import React, { useEffect, useRef, useState } from 'react';
import { registerPlayerWebComponent, VideoFormat, VideoQuality } from '@vkontakte/videoplayer';
import { usePlayer } from './Player';
registerPlayerWebComponent()

// const iframe = `<iframe src="https://vk.com/video_ext.php?oid=-33119141&id=456240032&js_api=1" width="640" height="360" allow="autoplay; encrypted-media; fullscreen; picture-in-picture;" frameborder="0" allowfullscreen></iframe>`

const nop = ()=>{}

export const VKVideo = ({ src })=>{
    // const { onPlay=nop, onStop=nop } = useApp()
    const player = usePlayer()

    const ref = useRef()
    // const [player, setPlayer] = useState()
    // useEffect(()=>{
    //     const player = document.createElement('vk-video-player')
    //     ref.current.appendChild(player)

    //     player.initPlayer({
    //         videos: [
    //             {
    //                 unitedVideoId: '33119141_456240032',
    //                 sources: {
    //                     [VideoFormat.MPEG]: {
    //                         [VideoQuality.Q_720P]: src,
    //                     },
    //                 },
    //                 title: 'SUM VIDEO',
    //                 //  thumbUrl,
    //                 // videoId: '456240032',
    //             }
    //         ],
    //     })

    //     return ()=>{ ref.current.removeChild(player) }
    // },[])

    useEffect(()=>{
        // ref.current.innerHTML = iframe
        const vkplayer = VK.VideoPlayer(ref.current);
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
    return <div>
        <iframe ref={ref} src={src} width="640" height="360" allow="autoplay; encrypted-media; fullscreen; picture-in-picture;" frameBorder="0" allowFullScreen></iframe>
    </div>
 }

 export default VKVideo
