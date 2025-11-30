import React, { useEffect, useRef, useState } from 'react';
import { registerPlayerWebComponent, VideoFormat, VideoQuality } from '@vkontakte/videoplayer';
registerPlayerWebComponent()

 export const VKVideo = ({ src })=>{
    const ref = useRef()
    const [player, setPlayer] = useState()
    useEffect(()=>{
        const player = document.createElement('vk-video-player')
        ref.current.appendChild(player)

        player.initPlayer({
            videos: [
                {
                    unitedVideoId: '33119141_456240032',
                    sources: {
                        [VideoFormat.MPEG]: {
                            [VideoQuality.Q_720P]: src,
                        },
                    },
                    title: 'SUM VIDEO',
                    //  thumbUrl,
                    // videoId: '456240032',
                }
            ],
        })

        return ()=>{ ref.current.removeChild(player) }
    },[])
    

    // return <VKVideoPlayer/>
    return <div className="vkvideo" ref={ref}/>
 }

 export default VKVideo
