import React from 'react'
// import Text from '@ips/react/components/text'
import Overlay from '@ips/react/components/overlay'
import Fixed from '@ips/react/components/fixed'
import {Column, Row} from '@ips/react/components/layout'
import { isFunction } from '@ips/app/hidash'
import { useLockBodyScroll, useLockHtmlScroll } from '@/hooks/useLockBodyScroll'
import { useScene } from '@ips/react/components/utils/use-scene'
//import CrossIcon from '@/svg/crossIcon.svg'

import Portal from './Portal'

const ModalOverlay = ({children, className, close})=>{

	const scene = useScene()
	const isDesktop = !scene.mobile

	// useLockBodyScroll()
	useLockHtmlScroll()

	const C = isDesktop ? Overlay : Fixed

	const core = <C className="smModalOverlay" cover style={{
		'--vw': `${scene.vw}px`,
		'--vh': `${scene.vh}px`,
	}}>
		{ isFunction(children) ? children({close}) : children }
		{/* { close ? <Overlay className="closeBtn" tangible onClick={close}>
			<CrossIcon/>
		</Overlay> : null } */}
	</C>

	return isDesktop? core : (<Portal className={className}>{ core }</Portal>)
}

export default ({isOpen, ...p})=>(
	isOpen ? <ModalOverlay {...p}/> : null
)
