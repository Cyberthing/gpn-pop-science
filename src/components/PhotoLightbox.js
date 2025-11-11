import React,  { forwardRef, useState } from 'react';
import Portal from './Portal'
import Media from './Media'
import AText from '@/components/AText'
import Overlay from '@ips/react/components/overlay'
import Fixed from '@ips/react/components/fixed';
import CrossSvg from '@/svg/cross.svg'

export const PhotoLightbox = ({ data, startRect, close, })=>{
	if(!data)
		return null
	return <Portal>
		<Fixed cover className="smPhotoLightbox">
			<Media media={data.media} style={{ maxWidth: '720px' }}/>
			<AText style="photoRowCredit" text={data.credit}/>
			<Overlay 
			 	className="btnClose"
				 style={{
					left: 'auto',
					right: '30px',
					top: '80px',
				}}
				onClick={close}
			>
				<CrossSvg/>
			</Overlay>
		</Fixed>
	</Portal>
}

export default PhotoLightbox