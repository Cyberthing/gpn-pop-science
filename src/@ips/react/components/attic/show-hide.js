import React, { Component } from 'react'
import Base from './base'
import { register, request } from '@ips/app/app-registry'
import _ from 'lodash'

import "./animations.styl"
import './show-hide.styl'

export class ShowHide extends Base{
    state = { visible:false }

    recalc(props, state, force){
        const { className, anim, animIn, animOut, animTime, instant } = props
        const { visible } = state

        let cprops = super.recalc(props, state, force)

        // trace('show-hide recalc', visible, this)

        cprops.className =`show-hide ${ className||'' }`

        if(visible != this.state.visible || force){ // visibility updated
            if(instant){
                // cprops.style = { visibility: (visible ? '':'hidden') }
                cprops.style = { display: (visible ? '':'none') }
            }else{
                cprops.style = { animationName:( visible ? (animIn||anim||'FadeIn') : (animOut||anim||'FadeOut')) }
                if(animTime)
                    cprops.style.animationDuration = `${ animTime }s`
            }
        }
        
        return cprops
    }    

    render(){
        const res = this.reduceRender()
        if(res)
            return res;

        const { children } = this.props
        const { className, style } = this.cprops

        return  <div ref={ ref => this.$el = ref } className={ className } style={ style }>
                    { children }
                </div>
    }

    reduceRender(){
        const { reduce, children } = this.props
        const { className, style } = this.cprops

        // return _.isArray(children) ? children.length == 1 : true
        if(reduce){
            // trace('sh reduce children', this, children)
            if(_.isArray(children) && children.length > 1){
                warn('show-hide: cannot reduce tag since it has more than 1 child')
                return
            }else{
                const child = _.isArray(children) ? children[0] : children
                const Tag = child.type
                const props = { ...child.props }
                props.className = (props.className||'') + ' ' + className
                props.style = { ...(props.style||{}), ...style }

                // trace('Tag', Tag, props)
                return <Tag ref={ ref => this.$el = ref } { ...props }/>
            }
        }
    }
    
    async created(){
        const { name, trigger, visible, show, hide } = this.props

        if(trigger){
            const straight = !trigger.startsWith('!')
            const triggerName = straight ? trigger : trigger.substr(1)
            const res = await request([triggerName])
            trace('got triggad', res)
            const t = res[triggerName]

            if(straight){
                this.setState({ visible:t.state.visible })
                t.on('visible', ()=>this.setState({ visible:true }))
                t.on('invisible', ()=>this.setState({ visible:false }))
            }else{
                this.setState({ visible: !t.state.visible })
                t.on('invisible', ()=>this.setState({ visible:true }))
                t.on('visible', ()=>this.setState({ visible:false }))
            }
        }

        this.renderExpr('visible', visible, v=>this.setState({ visible:v }))
        this.renderExpr('show', show, v=>this.setState({ show:v }))
        this.renderExpr('hide', hide, v=>this.setState({ hide:v }))
    }

    updated(prevProps, prevState){

        if(prevProps.visible != this.props.visible){ // a case of external visibility control through props
            this.setState({ visible:this.props.visible })
        }

        // handle triggers
        if(this.state.hide){
            this.setState({ hide: false, visible:false })
        }

        if(this.state.show){
            this.setState({ show: false, visible:true })
        }        
    }

}

//props:['name', 'classname', 'trigger'],
//visible:false,


export default ShowHide