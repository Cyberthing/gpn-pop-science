import React from 'react'
import Base from 'components/base'
import { register, request } from '@ips/app/app-registry'
import SwiperJS from './lib/swiper'
import './swiper.styl'

import * as __ from '@ips/app/hidash'

import EventPipe from '@ips/app/event-pipe'

export class Swiper extends Base{
    async created(){
        super.created()
        this.updateInstance()

        const { current } = this.props
        this.renderExpr('current', current, v => this.setState({ current: v }))

        trace('swiper', this)
    }

    updated(prevProps, prevState){
        if(!this.swiper)
            return
        const { current } = this.state
        if(current != prevState.current){
            this.swiper.slideTo(current, 1000)
        }
    }

    updateInstance(){

        const { speed, nav, pagination } = this.props;

        console.log('updateInstance', this);

        if(this.swiper){
            this.swiper.destroy();
            this.swiper = null;
        }

        if(this.swcon){
            const cfg = {
                loop: this.loop,
                uniqueNavElements: true,
                speed:speed||300,
            }

            if(nav != false){
                cfg.navigation = {
                    nextEl: this.$el.querySelector('.swiper-button-next'),
                    prevEl: this.$el.querySelector('.swiper-button-prev'),
                    // pagination: '.swiper-pagination',
                }
            }

            if(pagination){
                cfg.pagination = {
                    el: this.$el.querySelector('.swiper-pagination'),
                    type: 'bullets',
                    clickable:true
                }
            }

            this.swiper = new SwiperJS(this.swcon, cfg)

            this.swiper.on('slideChange', ()=>{
                this.swiper.pagination.update()
                this.ee.fire('change', {index:this.swiper.realIndex})
            })
            //console.log('made new swiper', this.swiper);
        }
    }

    recalc(props, state){
        const { className, children, current } = props;
        // let { curSlidePipe } = this.cprops||{};

        // if(curSlidePipe){
        //     curSlidePipe.destroy()
        // }

        // if(current.startsWith('eventPipe')){
        //     curSlidePipe = EventPipe.parse(current)
        //     curSlidePipe.on('update', v => this.swiper.slideTo(v, 1000))
        // }

        // if(this.swiper && state.current != this.state.current){
        //     trace('sliding', state.current)
        //     //this.swiper.slideTo(state.current)
        // }

        return {
            // curSlidePipe,
            className: `swiper ${ className }`,
            wchildren: __.map(children, (c, i)=> <div key={ i } className="swiper-slide">{ c }</div>),
        }
    }

    render(){
        const { className, wchildren } = this.cprops
        const { reverse, pagination } = this.props

        return ( <div ref={ ref=> this.$el = ref } className={ className }>
                    <div className="swiper-button-prev swiper-button-white"/>
                    <div className="swiper-button-next swiper-button-white"/>
                    <div className="swiper-pagination"/>
                    <div className="swiper-container" dir={ reverse ? 'rtl': null } ref={ ref=> this.swcon = ref }>
                        <div className="swiper-wrapper">
                            { wchildren }
                        </div>
                    </div>
                </div> )
    }
}

// "mod",
// "loop"
// data(){
//     return {
//         mod: "",
//         loop: true,
//     }
// },

export default Swiper