import React from 'react'
import Base from './base'
import PropTypes from 'prop-types';
import _ from 'lodash'

import EventPipe from '@ips/app/event-pipe'
import { register, request } from '@ips/app/app-registry'
import Overlay from './overlay'


import './timeline.styl'

const calcHeight = (c)=>{

    const element = c.cloneNode()
    element.style.visibility = "hidden";
    element.style.display = 'block'
    document.body.appendChild(element);
    var height = (element.offsetHeight + 0)|0;
    document.body.removeChild(element);
    return height;

    // const disp = c.style.display
    // c.style.display = 'block'
    // const h = c.offsetHeight
    // c.style.display = disp
    // return h
}

export class Timeline extends Base{
    
    recalc(props, state){
        const { stops, stopsX, stopsY, className, mode, fadeshift } = props;

        const rxSpaces = /\s+/

        const cprops = {
            className: `timeline timeline_${ mode } ${ fadeshift ? 'timeline_fadeshift' : ''} ${ className||'' }`
        }
        if(stops)
            cprops.stops = _.map((stops||'').split(rxSpaces), s=>( s[s.length-1]=='%' ? parseFloat(s.slice(0, s.length-1))*1e-2 : parseFloat(s) ))
        if(stopsX)
            cprops.stopsX = (stopsX||'').split(rxSpaces)//.reverse()
        if(stopsY)
            cprops.stopsY = (stopsY||'').split(rxSpaces)//.reverse()

        return cprops
    }

    render(){
        const { children, mode } = this.props
        const { className } = this.cprops
        const { current } = this.state

        if(mode == 'fade' || mode == 'instant'){
            return <div ref={ ref=> this.$el = ref } className={ className }>
                        { _.map(children, (c, i) => <Overlay cover key={ i } className={ current == i ? 'timeline__layer timeline__layer-current': 'timeline__layer timeline__layer-hidden' }>
                            { c }
                            </Overlay>)}
                        </div>
        }
        return <div ref={ ref=> this.$el = ref } className={ className }>{ children }</div>
    }

    async created(){
        super.created()

        const { source, current, reverse, mode, autoHeight, speed } = this.props
        const { stops, stopsX } = this.cprops

        if(autoHeight){
            setTimeout(()=>{ 
                this.$el.style.height = _.max(_.map(this.$el.children, c => calcHeight(c) )) + 'px'
            }, 100)   
        }

        const cucu = current||source

        this.renderExpr('current', cucu, v=>this.setState({ current: v|0 }))

        if(cucu.startsWith('eventPipe')){
            const pipe = EventPipe.parse(cucu)
            let update;

            if(mode == 'fade'){
                update = v=> this.setState({ current: v})
            }else{
                if(speed){
                    this.$el.style.transition = `transform ${ speed }s`
                }

                if(stopsX){
                    update = v=> this.$el.style.transform = `translateX(${ stopsX[v] }%)`
                }
                else
                if(reverse){
                    update = v=> this.$el.style.transform = `translateX(-${ v*100 }%)`
                }
                else{
                    update = v=> this.$el.style.transform = `translateX(${ v*100 }%)`
                }
            }
            pipe.on('update', update)
        }else{

            // const res = await request([source])
            // //trace('timeline compos', res)

            // this.curStop = -1;
            // res[source].on('update', e =>{
            //     //trace('e', e)
            //     var newStop = -1;
            //     while(newStop < stops.length){
            //         if(stops[newStop] >= e.pos)
            //             break;
            //         newStop++
            //     }

            //     if(this.curStop != newStop){
            //         //trace('gotcha', e, newStop, this.curStop)
            //         this.$el.style.transform = `translateX(${ stopsX[newStop] })`
            //         this.curStop = newStop
            //     }

            //     //if(e.pos)
            //     //target
            // })    

        }    

        window.addEventListener('resize', this.resize)
    }

    destroyed(){
        super.destroyed()
        window.removeEventListener('resize', this.resize)
    }

    resize = _.throttle(()=>{
        const { autoHeight } = this.props

        if(autoHeight){
            setTimeout(()=>{ 
                this.$el.style.height = _.max(_.map(this.$el.children, c => calcHeight(c) )) + 'px'
            }, 100)   
        }        
    }, 500)

}

Timeline.propTypes = {
    autoHeight: PropTypes.bool,
}

Timeline.defaultProps = {
    autoHeight: true,
}


//source="st1" target="ships" stops="0 50% 100%" stopsX="0 50% 100%" interpolate={ false }/>

/*<Timeline className="rowtl flaps" source="sh23" target="target" stops="0 .3 .7 1" stopsX="-200vw -100vw 0 100vw" stopsY="">
    <FullScreen className="overcut">
        <SpaceAround>
            <Cdiv>
                <Fig className="vflaps" caption="" src="http://10.1.125.69:9090/uploads/image/path/383/383.svg" position="" height="" imgheight=""/>
            </Cdiv>
        </SpaceAround>
    </FullScreen>
</Timeline>*/

export default Timeline