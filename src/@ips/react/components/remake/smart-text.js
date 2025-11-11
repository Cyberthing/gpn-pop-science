import React from 'react'
import Base from './base'
import _ from 'lodash'

import carryUnions from '@ips/typo/carry-unions'
// import { shyify, syllabify } from '@ips/typo/shyify'
import { getMappedLengths } from '@ips/app/font-analyzer'

import './smart-text.styl'

// getMappedLengths({ fontFamily: 'Times New Roman', fontSize: '16px', fontWeight: 'bold' })
// getMappedLengths({ fontFamily: 'Times New Roman', fontSize: '17px' })
// getMappedLengths({ fontFamily: 'Times New Roman', fontSize: '17px', fontWeight: 'bold' })

var RusA = "[абвгдеёжзийклмнопрстуфхцчшщъыьэюя]";
var RusV = "[аеёиоуыэю\я]";
var RusN = "[бвгджзклмнпрстфхцчшщ]";
var RusX = "[йъь]";

var re1 = new RegExp("("+RusX+")("+RusA+RusA+")","ig");
var re2 = new RegExp("("+RusV+")("+RusV+RusA+")","ig");
var re3 = new RegExp("("+RusV+RusN+")("+RusN+RusV+")","ig");
var re4 = new RegExp("("+RusN+RusV+")("+RusN+RusV+")","ig");
var re5 = new RegExp("("+RusV+RusN+")("+RusN+RusN+RusV+")","ig");
var re6 = new RegExp("("+RusV+RusN+RusN+")("+RusN+RusN+RusV+")","ig");

var shy = "$1\xAD$2"

export function shyify (text){
    text = text.replace(re1, shy);
    text = text.replace(re2, shy);
    text = text.replace(re3, shy);
    text = text.replace(re4, shy);
    text = text.replace(re5, shy);
    text = text.replace(re6, shy);
    return text;
}

export function syllabify (text){
    return shyify(text).split('\xAD')
}

const doCarryUnions = carryUnions
const doSyllabify = syllabify

const wl = (w, m)=> _.reduce(_.map(w, c => m[c]), (a, l)=> a+l, 0)

const tstyle = { fontFamily: 'Times New Roman', fontSize: '16px', fontWeight: 'normal', paddingTop:'30px', letterSpacing:'0px' }

// this func is just for test
let $spanLen
const spanLen = (t, s)=>{
    if($spanLen){
        $spanLen.parentElement.removeChild($spanLen)
        // document.body.removeChild($spanLen)
        $spanLen  = null
    }
    $spanLen = document.createElement('span')
    $spanLen.className = 'span-len'
    $spanLen.style.top = 0
    $spanLen.style.left = 0
    $spanLen.style.position = 'absolute'
    $spanLen.style.visibility = 'hidden'
    document.body.appendChild($spanLen)

    Object.assign($spanLen.style, s)
    $spanLen.innerText = t
    return $spanLen.offsetWidth
}

export class SmartText extends Base{

    // recalc(props, state, force){
    //     let cprops = super.recalc(props, state, force)
    // }

    state = { rendad: false }

    recalc(props, state, force){
        trace('recalc', this)
        const { text, syllabify, carryUnions } = props
        let cprops = super.recalc(props, state, force)
        // cprops.text = shyify(text)

        cprops.text = carryUnions ? doCarryUnions(text) : text

        if(syllabify){
            cprops.syl = cprops.text.split(' ').map(doSyllabify)
            this.m = getMappedLengths(tstyle)
            cprops.syllens = _.map(cprops.syl, w => _.map(w, s=> wl(s, this.m)))
            trace('sylcount', _.reduce(_.map(cprops.syl, w => w.length), (a, c)=> a+c, 0))
        }
        if(this.$el && carryUnions != this.props.carryUnions || force)
            this.setState({ rendad: false })

        return cprops
    }

    render(){
        const { className, justify, syllabify } = this.props
        const { text } = this.cprops
        const { lines } = this.state
         // dangerouslySetInnerHTML={{ __html: text }}

        const cstyle = tstyle //{ ...tstyle, ...{ textAlign:'justify' }}
                    // { text }

        if(syllabify)
            return  <div ref={ ref=> this.$el = ref } className={ `text text_syl ${ className||'' }${ justify ? 'text_justify':'' }` } style={ cstyle }>
                        { _.map(lines, (l, i) =><div key={ i }>{ l }</div>) }
                    </div>

            return <div ref={ ref=> this.$el = ref } className={ `text ${ className||'' }${ justify ? 'text_justify':'' }` } style={ cstyle }>
                        { text }
                    </div>
    }

    created(){
        trace('text created', this)
        this.build()

        window.addEventListener('resize', this.resize)
    }

    updated(prevProps, prevState){
        if(prevState.rendad)
        this.build()
    }

    build(){
        const { syllabify } = this.props
        if(!syllabify) return

        const { rendad } = this.state
        if(!rendad){
            const { syl, syllens } = this.cprops

            const space = this.m[' ']
            const hyphen = this.m['-']

            const maxl = this.$el.clientWidth * 1
            trace('rendad', maxl)
            let finaltext = ''
            let ll = 0
            let ln = 0
            let cl = ''

            const lines = []
            _.each(syl, (w, i) => {
                _.each(w, (s, j) => {
                    const last = w.length - 1
                    const sl = syllens[i][j]
                    // trace('>', s, ll, sl, hyphen)

                    if(!j){
                        if(!last){
                            if((ll + sl) > maxl){
                                // trace('v')
                                // finaltext += '\xAD'
                                // finaltext += '<br>'
                                lines.push(cl)

                                if(ln < 6)
                                    trace(`0gozamdo '${ cl }' ${ ll } ${ spanLen(cl) }`)
                                ll = 0
                                cl = ''
                                ln ++
                            }

                        }else{
                            if((ll + sl + hyphen) > maxl){
                                // trace('v')
                                // finaltext += '\xAD'
                                // finaltext += '<br>'
                                lines.push(cl)

                                if(ln < 6)
                                    trace(`0gozamdo1 '${ cl }' ${ ll } ${ spanLen(cl) }`)
                                ll = 0
                                cl = ''
                                ln ++
                            }
                        }

                    }else{
                        if(j != last && (ll + sl + hyphen) > maxl){
                            // trace('v')
                            // finaltext += '-<br>'
                            // finaltext += '\xAD'

                            cl += '-'
                            lines.push(cl)

                            if(ln < 6)
                                trace(`gozamdo '${ cl }' ${ ll } ${ spanLen(cl) }`)
                            ll = 0
                            cl = ''
                            ln ++
                        }
                        if(j == last){
                            if(ll + sl > maxl){
                                // trace('vv')
                                // finaltext += '-<br>'
                                // finaltext += '\xAD'

                                cl += '-'
                                lines.push(cl)

                                if(ln < 6)
                                    trace(`gozamdoq '${ cl }' ${ ll } ${ spanLen(cl) }`)
                                ll = 0
                                cl = ''
                                ln ++
                            }
                        }
                    }

                    cl += s
                    finaltext += s
                    ll += sl

                    if(j == last){
                        ll += space
                        cl += ' '
                        finaltext += ' '
                        // if(ln < 6)
                        //     trace(`ebgozamdoq '${ cl }' ${ ll } ${ spanLen(cl) }`)
                        // ll = 0
                        // cl = ''
                        // ln ++
                    }                    
                })
            })
            lines.push(cl)
            //trace('finaltext', finaltext)
            this.setState({ lines, text : finaltext, rendad:true })
        }
    }

    resize = ()=>{
        this.setState({ rendad: false})
    }
}

export default SmartText