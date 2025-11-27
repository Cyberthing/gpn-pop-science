import React,  { Fragment, createRef, useRef, useState, useEffect, useCallback, useMemo, memo } from 'react';
import { useScene } from '@ips/react/components/utils/use-scene';
import cx from '@ips/app/classnamex'
import { Column, Row } from '@ips/react/components/layout';
import { Slice } from '@/components/Slice';
import Overlay from '@ips/react/components/overlay'
import Sticky from '@ips/react/components/sticky'
import AText from './AText'
// import { colors } from '@/vars'
import Media from '@/components/Media'
import MediaBack from '@/components/MediaBack'

export const Cover = ({ uptitle, title, titleImage, lead, msgAudio }) => {
	const scene = useScene()

	const r = (
		<Slice 
			className={'coverPage'}
		>
			<Column
				className="coverCont"
				align="center"
				w100
			>
				<AText style="coverUptitle" text={uptitle}/>
				<Media media={{ url: titleImage }} width="70%"/>
				{/* <AText style="coverTitle" text={title}/> */}
				<Column width="6">
					<AText noGutter={false} style="coverLead" text={lead}/>
				</Column>
				<Media className="msgAudio" media={{ url: msgAudio }}/>
			</Column>
		</Slice>
	)
	return r

	//return scene.mobile ?  r  : 
	//	(<Overlay>
	//		{r}
	//	</Overlay>)
}

export default Cover
