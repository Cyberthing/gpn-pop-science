import React,  { forwardRef, memo, useCallback, useState } from 'react';
//import { Column, Slice as LayoutSlice } from '@ips/react/components/layout';
import cx from '@ips/app/classnamex'
import Media from './Media'

export const CircleVideo = memo(
    forwardRef(({className, backPlate, media, ...p}, ref)=>{

    // console.log('CircleVideo', media)
    const [playing, setPlaying] = useState(false)
    const [progress, _setProgress] = useState(0)
    const setProgress = useCallback((progress, duration)=>{
        console.log('setProgress', progress, duration)
        _setProgress(progress/duration*100)
        
    },[])
    const togglePlay = useCallback(()=>{ setPlaying(s=>!s) },[])
    console.log('CircleVideo', media, playing)
    
    return (<div
        className={cx('circleVideo')}
        onClick={togglePlay}
        style={{
            '--progress': '' + progress
        }}
    >
        <div className='cprogress-underlay'>
            <svg
                width="480" 
                height="480" 
                viewBox="0 0 480 480"
                className="cprogress" 
            >
                {/* <circle className="bg" cx="125" cy="125" r="115" fill="none" stroke="#ddd" stroke-width="20"></circle> */}
                <circle className="fg" cx="240" cy="240" r="236" fill="none" stroke="#5394fd" stroke-width="4"></circle>
            </svg>
        </div>
        <Media
            ref={ref}
            // onClick={()=>console.log('click')}
            onProgress={setProgress}
            progressThrottle={0.3}
            rewind
            autoPlay={playing}
            muted={false}
            loop={false}
            // {...p}
            media={{ url: media }}
        />
    </div>)
}))

export default CircleVideo