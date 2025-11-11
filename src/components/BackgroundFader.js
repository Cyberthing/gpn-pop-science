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
import Slice from '@/components/Slice';
import AText from '@/components/AText'
import { useConfig } from '@/hooks/useConfig'

//const Credit = (b)=>(
//	<Slice align="right" padding="70px 0 0 0" height="100%">
//		<Column width="3" h100 valign="bottom">
//			<AText style="backCredit" text={b.credit}/>
//		</Column>
//	</Slice>
//
//)

const Credit = ({ fade, ...b })=>{

  	const scene = useScene()
	const config = useConfig()

	return (
		<Slice align={scene.mobile?null:"right"} padding="70px 0 0 0" className="faderCredit">
			<Column width={scene.mobile?null:"3"} h100 valign="space-between">
				{ (!scene.mobile&&config.logoWhite.url) ? <Media media={config.logoWhite}/> : null }
				{ b.credit ? <AText className={cx(fade&&'onfade')} style="backCredit" text={
					scene.mobile ? `<mark>${b.credit}</mark>` : b.credit
				}/> : null }
			</Column>
		</Slice>
	)
}

export const BackgroundFader = ({ backs, fade, current })=>{
  	const scene = useScene()

	//const rBacks = useMemo(()=>backs.map(b=>(<>
	//	<MediaBack media={b.media} className={cx(b.style !="nofade" && fade && "backGrad", (scene.height/scene.width) > (3/4) && "vert")}/>
	//	<Credit {...b}/>
	//</>)),[backs, scene.height/scene.width])

	//trace('BackgroundFader', current)

	const b = backs[current]

	return (
    	<StickyFrame>
    		<FadeDrop slide={
				<>
					<MediaBack media={b.media} className={cx("back", b.style, b.style !="nofade" && fade && "backGrad", (scene.height/scene.width) > (0.7111111111111) && "vert")}/>
					<Credit {...b} fade={fade}/>
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