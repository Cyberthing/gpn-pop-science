import React, { Component } from 'react'
import RevealingText from './revealing-text'
import './revealing-text--sample.styl'

export default class RevealingTextSample extends Component{

    constructor(){
        super()

        this.self = React.createRef()
    }

    render(){
        const { s, text } = this.props
        return  <div className='revealing-text-demo--sample'>
                    <div className='info'>{ typeof(s.anim) == 'string' ? s.anim : 'fn' } { s.split } { s.showTime } { s.animTime }</div>
                    <RevealingText ref={ this.self } class={ s.class } anim={ s.anim } split={ s.split } showTime={ s.showTime } animTime={ s.animTime } text={ text }/>
                    <button onClick= { this.replay }>Replay</button>
                </div>
    }

    replay = ()=>{
        if(this.self.current)
            this.self.current.replay()
    }

}
