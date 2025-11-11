import React, { useRef, useEffect, forwardRef } from 'react'
import { useMemo } from 'use-memo-one'
import cx from '@ips/app/classnamex'

import { ToggleClassName } from './ref-apply'

export const Display = forwardRef((p, ref)=><ToggleClassName {...p} ref={ref} on={!p.on} className="display_none"/>)

Display.displayName = 'Display'
