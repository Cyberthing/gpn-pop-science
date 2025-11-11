import React from 'react'
import Text from '@ips/react/components/text'
// import MediaBack from '@/components/MediaBack'
import {Column, Row} from '@ips/react/components/layout'
import {Sticky} from '@ips/react/components/sticky'
import {Overlay} from '@ips/react/components/overlay'
import { useScene } from '@ips/react/components/utils/use-scene'

export default ({ children, height })=>{
	return (
		<Overlay 
			cover 
			className="sticky-frame"
			style={{
				'--height': `${height}px`,
			}}
		>
			<Sticky >
				{ children }
			</Sticky>
		</Overlay>
	)
}