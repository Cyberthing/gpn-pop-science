import React, { Component } from 'react'
import './revealing-text.styl'
import { register } from '@ips/app/app-registry'
import PropTypes from 'prop-types';
import _ from 'lodash'

const Animations = {
    fadeIn:(e, i, animTime, showTime, els) => ({ animation: `fadeIn ${ animTime||1 }s ${ showTime*i/els.length }s linear both` }),
    slideUp:(e, i, animTime, showTime, els) => ({ animation: `slideUp ${ animTime||1 }s ${ showTime*i/els.length }s ease-out both` }),
    slideDownEmp:(e, i, animTime, showTime, els) => ({ animation: `slideDownEmp ${ animTime||1 }s ${ showTime*i/els.length }s linear both` }),
    slideFlip:(e, i, animTime, showTime, els) => ({animation: `${ (i%2) ? 'slideUp' : 'slideDown' } ${ animTime||1 }s ${ showTime*i/els.length }s linear both` }),
    rollFlip:(e, i, animTime, showTime, els) => ({ animation: `${ (i%2) ? 'rollInLeft' : 'rollInRight' } ${ animTime||1 }s ${ showTime*i/els.length }s linear both` }),
}

export class RevealingText extends Component{
    constructor(props){
        super(props)

        this.state = {
            els:[],
            progress:0,
            elStyle:()=>{}
        }        
    }

    componentDidMount(){
        // trace('revealing-text', this)
        const p = this.props;

        if(p.mode == 'dynamic')
            this.initLoop()

        // this.on('replay', ()=>{

        // })

        this.initElements()
        this.setState({ elStyle: Animations[p.anim]||p.anim })
    }

    componentDidUpdate(pp){
        const p = this.props;
        if(p.text != pp.text){
            this.initElements()
        }

        if(p.anim != pp.anim){
            this.setState({ elStyle: Animations[p.anim]||p.anim })
        }
    }

    initElements(){
        const p = this.props;

        let els = []
        if(p.split == 'lines'){
            els = _.map(p.text.split('\n'), p => p + '\n')
        }else
        if(p.split == 'words'){
            els = p.text.split(' ')//_.map(, p => p + ' ')
        }else{
            els = p.text
        }

        this.setState({ els })
    }

    replay(){
        const p = this.props
        this.setState({ elStyle:()=>{} })
        setTimeout(()=>{
            this.setState({ elStyle: Animations[p.anim]||p.anim })
        }, 100)
    }

    initLoop(){
        let time = 0;
        const updatePC = ()=>{
            // return
            if(this.weredone)
                return

            const p = this.props;
            const s = this.state;

            let newtime = Date.now()/1000.
            const dt = Math.min(newtime - time, 1);

            this.setState({ progress: s.progress + p.speed * dt });

            time = newtime;

            requestAnimationFrame(updatePC)
        }
        updatePC()                
    }

    elStyle2(e, i, animTime, showTime, els){
        // trace(e, i, progress)
        return `animation: fadeIn ${ animTime||1 }s ${ showTime*i/els.length }s linear both;`
    }

    elDynStyle(e, i, progress, els){
        // trace(e, i, progress)
        const rp = progress - Math.floor(progress)
        return `visibility:${ i/els.length > rp ? 'hidden': 'visible' };`
    }

    render(){
        const p = this.props
        const s = this.state

        return <div className={ `revealing-text ${ p.class }` }>
                    { 
                        p.mode == 'dynamic'?
                            _.map(s.els, (e, i)=><span key={i} style={ this.elDynStyle(e, i, s.progress, s.els) }>{ e }</span>)
                        :
                            _.map(s.els, (e, i)=>[<span key={i} style={ s.elStyle(e, i, p.animTime, p.showTime, s.els) }>{ e == ' ' ? '\u00A0' : e }</span>,
                                p.split == 'letters' ? '' : ' ' ])
                    }
                </div>
    }
}

RevealingText.propTypes = {
    text: PropTypes.string,
    name: PropTypes.string,
    class: PropTypes.string,
    split: PropTypes.string,
    speed: PropTypes.number,
    mode: PropTypes.string,
    anim: PropTypes.any,
    animTime: PropTypes.number,
    showTime: PropTypes.number,
}

RevealingText.defaultProps = {
    text:'',
    name: null,
    class: '',
    split:'letters', // [ letters | words | lines ]
    speed:1,
    mode:'css', // [ css | dynamic ]
    anim:'fadeIn', // [ fadeIn | slideUp | slideFlip | rollFlip ]
    animTime:1,
    showTime:2,
}

export default RevealingText