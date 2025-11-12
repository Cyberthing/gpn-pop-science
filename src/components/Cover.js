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

export const Cover = ({ uptitle, title, lead }) => {
	const scene = useScene()

	const r = (
		<Slice 
			className={'coverPage'}
		>
			<Column
				width="10"
				left="1"
				className="coverCont"
			>
				<AText style="coverUptitle" text={uptitle}/>
				<AText style="coverTitle" text={title}/>
				<AText noGutter={false} style="coverLead" text={lead}/>
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
