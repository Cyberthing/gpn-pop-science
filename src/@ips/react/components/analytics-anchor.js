import React, { Component } from 'react'
import { ActivationContext } from './activation'

//require('intersection-observer');
import * as Google from '@ips/app/google-tag-manager'
import * as Metrika from '@ips/app/metrika'

export class AnalyticsAnchor extends Component{

    state = { visible: false }

    render(){
        return <div ref={ ref=> this.$el = ref } data-id={ this.props.id } style={this.props.style}/>
    }

    componentDidMount(){
        let options = {
            root: null,
            // rootMargin: "0px",
            // threshold: .5//buildThresholdList()
        };

        let observer = null
        const handleIntersect = (inters)=>{
            if(!this.context.active)
                return

            if(!this.state.visible && inters[0].intersectionRatio > 0){
                // console.log('anchor visible', this.props.id)
                this.setState({ visible: true })
                Google.event('anchor', { anchor:this.props.id })
                Metrika.event('anchor', { anchor:this.props.id })
                observer?.disconnect()
            }
        }

        const init = ()=>{
            observer = new IntersectionObserver(handleIntersect, options);
            observer.observe(this.$el);
        }
        this.props.delay ? setTimeout(init,((+this.props.delay)||0)*1000) : init()
    }
}

export default AnalyticsAnchor

AnalyticsAnchor.contextType = ActivationContext

//     props:['id'],
//     data(){
//         return { 
//             visible:false,
//         }
//     },
