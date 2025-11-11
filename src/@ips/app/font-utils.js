import Sizer from '@ips/app/sizer.js'
import { createStyle, flatRule } from '@ips/app/css-utils.js'
import { ud, isNumber } from '@ips/app/hidash.js'

import uniqueNumber from '@ips/app/unique-number.js'
const stylesheet = createStyle('text-sizes')
const textStyles = {}
// const name2style = {}

// trace('textStyles', textStyles)

const genDegradingMediaRule = (className, fontSize, fontSizeMobile, exp, ssizes, mobileSmall, w)=>(ssizes.map((s, i)=>
`@media (max-width: ${s+w}px) {
    .${ className } {
        font-size: ${((i==ssizes.length-1)&&fontSizeMobile) ? fontSizeMobile: Math.floor(fontSize/Math.pow(exp, (i+1)))}px;
    }
}`).join('\n')) + 
`
@media (max-width: ${mobileSmall}px) {
    .${ className } {
        font-size: calc(var(--rvw, 1vw) * ${mobileSmall});
    }
}`

const genDegradingNameRule = (className, fontSize, fontSizeMobile, exp, snames, mobileSmall, w)=>(snames.map((s, i)=>
`
.${s} .${ className } {
        font-size: ${((i==snames.length-1)&&fontSizeMobile) ? fontSizeMobile: Math.floor(fontSize/Math.pow(exp, (i+1)))}px;
}`).join('\n')) + 
`
@media (max-width: ${mobileSmall}px) {
    .${ className } {
        font-size: calc(var(--rvw, 1vw) * ${mobileSmall});
    }
}`

const genSpecRule = (s, className, props, name)=>(`.${s} .${ className } { ${ flatRule(props, name )} }`)


// Kebabize versions
// const afterAll = (str) => str.replace(/[A-Z]+(?![a-z])|[A-Z]/g, ($1, ofs) => (ofs ? "-" : "") + $1).toLowerCase()
// const afterEach = (str) => str.replace(/[A-Z]+(?![a-z])|[A-Z]/g, ($1, ofs) => (ofs ? "-" : "") + $1.toLowerCase())
// const marcs = (str) => str.replace(/((?<=[a-z\d])[A-Z]|(?<=[A-Z\d])[A-Z](?=[a-z]))/g, '-$1').toLowerCase()

const selectTextProps = ({fontFamily, fontFamilyDefault, fontSize, fontWeight, fontStyle, lineHeight, letterSpacing, color, opacity, textTransform, textAlign, margin, whiteSpace, wordBreak})=>
({
    fontFamily: ud(fontFamily)?undefined:(fontFamily+(fontFamilyDefault?(' ,'+fontFamilyDefault):'')), 
    fontSize: ud(fontSize)?undefined:(isNumber(+fontSize)?`${fontSize}px`:fontSize),
    fontWeight, 
    fontStyle, 
    lineHeight, 
    letterSpacing, 
    color, 
    opacity, 
    textTransform, 
    textAlign, 
    margin, 
    whiteSpace, 
    wordBreak 
})

export const createTextStyle = (p, uid, sizes={})=>{

    const { name, fontSize, fontSizeMobile, degradeExp = 1, fontSizes=[] } = p
    let baseTextProps = selectTextProps(p)

    if(isNaN(+fontSize)){
        error('cannot create text style with fontSize', fontSize)
        return
    }
    // const styleSign = `ts_${name||''}_${fontFamily||''}_${fontSize}_${degradeExp?('deg'+degradeExp):''}_${fontSizes.join('_')}`.replace(/\./g, '')
    const styleSign = `ts_${uid||''}`.replace(/\./g, '')

    if(textStyles[uid]){
        // trace('FontUtils.createTextStyle reusing', styleSign)
        textStyles[uid][3]++ // increment useCount
        return textStyles[uid]
    }

    const className = styleSign
    // trace('FontUtils.createTextStyle', className)

    if(sizes.desktop && p.desktop){
        baseTextProps = {...baseTextProps, ...selectTextProps(p.desktop) }
    }

    const rules = []
    const baseRule = stylesheet.addRule('.'+className, flatRule(baseTextProps, name));
    rules.push(baseRule)

    // const ssizes = [...Sizer.sizes()].reverse() // cant do reverse on the sizer arr since it's inplace. need to clone
    // const mediaRules = stylesheet.addRaw(genDegradingMediaRule(className, fontSize, fontSizeMobile, degradeExp, ssizes, 350, Modernizr['platform-windows'] ? 17: 0))

    // const snames = [sizes.mobile.className, sizes.tablet.className ]//, sizes.desktop.className ]


    const snames = [...Sizer.names()].reverse()
    snames.shift() // cant do reverse on the sizer arr since it's inplace. need to clone
    if(degradeExp > 1){
        const rule = genDegradingNameRule(className, fontSize, fontSizeMobile, degradeExp, snames, 350, Modernizr['platform-windows'] ? 17: 0)
        // trace('fontSizeMobile', fontSizeMobile, rule)
        const mediaRules = stylesheet.addRaw(rule)
        rules.push(mediaRules)
    }else{
        // const rule = genSpecRule(snames[snames.length-1], className, {fontSize:fontSizeMobile+'px'}, name)
        // stylesheet.addRaw(rule)
    }


    if(sizes.tablet && p.tablet){
        const tabletTextProps = selectTextProps(p.tablet)
        const tabletRule = genSpecRule(sizes.tablet.className, className, tabletTextProps, name)
        stylesheet.addRaw(tabletRule)
        rules.push(tabletRule)
    }

    const mobile = p.mobile || (fontSizeMobile ? { fontSize: fontSizeMobile } : null)

    if(sizes.mobile && mobile){
        const mobileTextProps = selectTextProps(mobile)
        const mobileRule = genSpecRule(sizes.mobile.className, className, mobileTextProps, name)
        const mri = stylesheet.addRaw(mobileRule)
        rules.push(mri)
    }

    textStyles[uid] = [className, uid, rules, 1] // useCount = 1
    // name2style[name] = textStyles[styleSign]

    return textStyles[uid]
}

export const removeTextStyle = style=>{
    // const style = textStyles[sign]
    if(!style)
        return
    
    // trace('FontUtils.removeTextStyle', style)

    style[3]-- // decrement useCount
    if(style[3]) // still in use
        return

    const [className, uid, rules] = style
    rules.forEach(r=>stylesheet.removeRaw(r))
    // stylesheet.removeRule(baseRule)
    textStyles[uid] = null
    // name2style[name] = null
}

// export const findTextStyle = name=>name2style[name]
