import {Howl, Howler} from 'howler';
import app from '@ips/app/app'

export const createPlayer = (tracks)=>{

    let curTrack
    let curTrackIndex

    // trace('createPlayer', tracks)
    let _onProgress = ()=>{}
    let progressInterval  = null

    const play = (i)=>{
        if(curTrack)
            curTrack.stop()

        curTrackIndex = i

        const t = tracks[i]
        curTrack = new Howl({ 
            src: [`${app.publicPath}/media/${t}`],
            loop: true,
         });
        curTrack.play();

        curTrack.on('play', ()=>{
            clearInterval(progressInterval)
            progressInterval = setInterval(()=>{
                const currentTime = curTrack.seek() || 0; // Get the current position in seconds
                const totalDuration = curTrack.duration(); // Get the total duration in seconds
                _onProgress(currentTime / totalDuration)
            }, 300)
        })
    }
    const onProgress = (cb)=>{
        _onProgress = cb
    }
    const resume = ()=>{
        if(!curTrack)
            return
        curTrack.play();
    }
    const resumeOrPlay = (i)=>{
        if(!curTrack)
            return play(i < 0 ? curTrackIndex : i)
        curTrack.play();
    }
    const stop = ()=>{
        // trace('stop', curTrack)
        if(!curTrack)
            return
        curTrack.stop()
        curTrack = null
    }
    const pause = ()=>{
        // trace('pause', curTrack)
        if(!curTrack)
            return
        curTrack.pause()
    }

    return {
        play,
        resume,
        resumeOrPlay,
        stop,
        pause,
        onProgress,
    }
}