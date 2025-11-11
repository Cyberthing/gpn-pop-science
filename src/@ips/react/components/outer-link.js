import React from 'react'
import { useMemo } from 'use-memo-one'
import './outer-link.styl'

import * as Metrika from '@ips/app/metrika'
import * as GTM from '@ips/app/google-tag-manager'

import { createStyle, useStyle } from '@ips/react/components/utils/use-style'
import cx from '@ips/app/classnamex'

const muhStyle = createStyle('outer-link')

function anaLink(e){
    // trace('reparong', this.getAttribute('href'))
    GTM.event('outer_link', { outer_link:e.target.getAttribute('href') })
    Metrika.event('outer_link', { outer_link:e.target.getAttribute('href') })
}

export const OuterLink = p => {

	const muhCss = useMemo(()=>`text-decoration: ${p.underline?'underline':'none'};`,[])

	const [styleClass] = useStyle(muhStyle, muhCss)

	return (<a 
				href={p.url||''} 
				target="_blank" 
				className={cx('outer-link', styleClass, p.className)} onClick={anaLink}>
            	{ p.children }
    		</a>)
}

export default OuterLink