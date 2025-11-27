import {Howl, Howler} from 'howler';
import app from '@ips/app/app'

export const createPlayer = (tracks)=>{

    let curTrack

    trace('createPlayer', tracks)

    return {
        play(i){
            if(curTrack)
                curTrack.stop()

            const t = tracks[i]
            curTrack = new Howl({ src: [`${app.publicPath}/media/${t}`] });
            curTrack.play();
        },
        stop(){
            curTrack.stop()
        },
        pause(){

        },
    }
}