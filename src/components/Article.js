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

factory.register('text', (p)=><AText style="articleBody" {...p}/>)

export const Article = ({ title, blocks, ...p })=>{
    // trace('Article', blocks)
    return <Slice>
        <Waypoint way="backs"/>
        <Slice.LeftSlot>
        </Slice.LeftSlot>
        <Slice.RightSlot className="articlePlate">
            <AText style="articleTitle" text={title}/>
            { blocks.map(factory.create) }
        </Slice.RightSlot>
    </Slice>
}

export default Article