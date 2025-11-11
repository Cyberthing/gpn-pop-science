import React from 'react'
import RevealingTextSample from './revealing-text--sample'
import './revealing-text--demo.styl'
import _ from 'lodash'

//'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',

const defaultText = 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'

const defaultShows = [
    { anim:'fadeIn', class:'zhban', split:'letters', showTime:2, animTime: .1},
    { anim:'fadeIn', class:'zhban', split:'words', showTime:3, animTime: .2},
    { anim: (e, i, animTime, showTime, els) => ({ animation: `fadeIn ${ animTime||1 }s ${ showTime*((i*65423)%els.length)/els.length }s linear both` }), class:'zhban', split:'words', showTime:5, animTime: 2},
    { anim:'slideFlip', class:'zhban', split:'words', showTime:3, animTime: .7},
    { anim:(e, i, animTime, showTime, els) => ({ animation: `${ (i%2) ? 'slideUpVis' : 'slideDownVis' } ${ animTime||1 }s ${ showTime*i/els.length }s linear both` }), class:'zhban', split:'letters', showTime:3, animTime: .3},
    { anim:(e, i, animTime, showTime, els) => ({ animation: `${ (i%2) ? 'slideUpVis' : 'slideDownVis' } ${ animTime||1 }s ${ showTime*((i*65423)%els.length)/els.length }s linear both` }), class:'zhban', split:'letters', showTime:3, animTime: .3},
    { anim:'slideUp', class:'zhban', split:'letters', showTime:3, animTime: .5},
    { anim: (e, i, animTime, showTime, els) => ({ animation: `dropDown ${ animTime||1 }s ${ showTime*i/els.length }s linear both` }), class:'zhban', split:'words', showTime:5, animTime: .15},
    { anim:'rollFlip', class:'zhban', split:'letters', showTime:3, animTime: .3},
]

export default ({ text = defaultText, className = '', shows = defaultShows })=> <div className={ `revealing-text-demo ${ className }` }>
            { _.map(shows, (s, i) => <RevealingTextSample key={ i } s={ s } text={ text }/> )}
        </div>


