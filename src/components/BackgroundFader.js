import React, { useMemo } from 'react'
import { useScene } from '@ips/react/components/utils/use-scene'
import Overlay from '@ips/react/components/overlay'
import Text from '@ips/react/components/text'
import MediaBack from '@/components/MediaBack';
import Media from '@/components/Media';
import cx from '@ips/app/classnamex'
import StickyFrame from '@/components/StickyFrame';
import FadeDrop from '@/components/FadeDrop';
import { Column, Row } from '@ips/react/components/layout';
import { useConfig } from '@/hooks/useConfig'

export const BackgroundFader = ({ backs, fade, current })=>{
  	const scene = useScene()

	//const rBacks = useMemo(()=>backs.map(b=>(<>
	//	<MediaBack media={b.media} className={cx(b.style !="nofade" && fade && "backGrad", (scene.height/scene.width) > (3/4) && "vert")}/>
	//	<Credit {...b}/>
	//</>)),[backs, scene.height/scene.width])

	trace('BackgroundFader', backs, current)

	const b = backs[current]

	return (
    	<StickyFrame>
    		<FadeDrop slide={
				<>
					<MediaBack autoPlay loop muted media={b.media} className={cx("backfader-back", b.style, b.style !="nofade" && fade && "backGrad", (scene.height/scene.width) > (0.7111111111111) && "vert")}/>
				</>    			
    			// rBacks[current]
    		} 
    		id={current  * 2 + fade}
    	/>
    		{/* <Overlay cover className="backGrad"/> */}
    	</StickyFrame>
	)
	
}

export default BackgroundFader