import React,  { Fragment, forwardRef, createRef, useRef, useState, useEffect, useCallback, useMemo, memo } from 'react';
import cx from '@ips/app/classnamex'
// import { times } from '@ips/app/hidash'

import { useScene } from '@ips/react/components/utils/use-scene'
// import { useIntersectionObserver } from '@ips/react/components/utils/use-intersection-observer'
// import { useRegistryEvent } from '@ips/react/components/utils/react-app-registry'

import Overlay from '@ips/react/components/overlay'
// import Sticky from '@ips/react/components/sticky'
import Emergent from '@ips/react/components/emergent'

import Pic from '@ips/react/components/pic'
import { AnalyticsAnchor } from '@ips/react/components/analytics-anchor';

import AText from '@/components/AText'

// import Way from '@ips/react/components/way'
import Waypoint from '@ips/react/components/waypoint'

// import Burger from '@/components/Burger'

import { getFullOffsetTop } from '@ips/app/dom-utils'
import { Column, Row } from '@ips/react/components/layout';
import Slice from '@/components/Slice';
import Media from '@/components/Media';
import MediaBack from '@/components/MediaBack';
// import { useScrollTracker } from '@/hooks/useScrollTracker'
import * as analytics from '@/analytics'
import { factory } from '@/components/factory';

const Quote = ({ text, desc, ava})=><Row 
        className="quoteCont"
        useGutter
        style={{
            gap: '27px',
        }}
    >
    <Column>
        <Media className="quoteAva" media={{url: ava }}/>
    </Column>
    <Column>
        <AText style="quoteDesc" noGutter text={desc}/>
        <AText style="quoteText" noGutter text={text}/>
    </Column>
</Row>

const Illustration = ({ image, desc, style })=><Row 
        className={cx("illCont", style)}
        useGutter
    >
    <Column className="ill">
        <Media media={{url: image }}/>
    </Column>
    <Column>
        <AText style="illDesc" noGutter text={desc}/>
    </Column>
</Row>

factory.register('text', (p)=><Column width="4"><AText style="articleBody" {...p}/></Column>)
factory.register('quote', Quote)
factory.register('illustration', Illustration)



export const Article = forwardRef(({ title, blocks, ...p }, ref)=>{
    // trace('Article', blocks)
    return <Slice ref={ref} className="articlePage">
        <Waypoint way="backs" edge="-50vh"/>
        <Slice.LeftSlot>
        </Slice.LeftSlot>
        <Slice.RightSlot className="articlePlate">
            <Column>
                <AText style="articleTitle" text={title}/>
                { blocks.map(factory.create) }
            </Column>
        </Slice.RightSlot>
    </Slice>
})
Article.displayName="Article"

export default Article