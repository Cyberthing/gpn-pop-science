import React, { Component, useRef, useState, useEffect, useContext, createContext } from 'react'
import { useMemo, useCallback } from 'use-memo-one'
import { createStyle, useStyle } from '@ips/react/components/utils/use-style'
import uniqueNumber from '@ips/app/unique-number'

const createLayoutStyleContext = parent=>createContext((()=>{
    const layoutStyleSheet = createStyle('layout-settings')

    const gutterClass = 'g' + uniqueNumber();
    let gutterStyle = `padding-left:16px;padding-right:16px;`
    const gutterRule = layoutStyleSheet.addRule('.'+gutterClass, gutterStyle)

    return {
        gutterClass:()=>gutterClass,
        gutter:()=>16,
        discreteAdaptive:()=>false,
        maxGridWidth:()=>1440,
        maxGrid:()=>'large',
        setGutter:(px=16)=>{
            gutterStyle=`padding-left:${g}px;padding-right:${g}px;`
            layoutStyleSheet.updateRule(gutterRule, gutterStyle)
        }
    }
})())

export const LayoutStyleContext = createLayoutStyleContext()

export const useLayoutStyle = ()=>useContext(LayoutStyleContext)
