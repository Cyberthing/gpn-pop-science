import React from 'react'
import Base from 'components/base'
import _ from 'lodash'

import Sprite3D from './lib/sprite3D'

import './waydown.styl'

export class Waydown extends Base{
    state = {
        pre:true
    }

    recalc(props, state, force){

    }

    renderMobile(){
        const { children, className } = this.props
        return <div ref={ ref => this.$el = ref } className={`waydown ${ className||'' }`}>
                    { children }
                </div>
    }

    render(){

        // if(Modernizr['platform-mobile'])
        //     return this.renderMobile()

        const { children, className } = this.props
        // const { pre } = this.state

        return  <div ref={ ref => this.$el = ref } className={`sprite3d-camera waydown ${ className||'' }`}>
                    <div ref={ ref => this.$stage = ref } className="sprite3d-stage">
                        { children }
                    </div>
                </div>
    }

    created(){
        trace('Waydown created', this, this.$pre)
        const { current } = this.props
        const { pre } = this.state
        if(pre){


            Promise.all(_.map(this.$el.querySelectorAll('img'), img => new Promise((resolve, reject)=>{
                img.addEventListener('load', resolve)
                img.addEventListener('error', resolve)
            }))).then((res)=>{


                var camera = Sprite3D.camera(this.$el).perspective(290)
                // camera.className = 'sprite3d-camera'
                this.camera = camera
                
                var stage = Sprite3D.stage(this.$stage, camera)
                this.stage = stage
                // stage
                //     // .origin('center')
                //     .position(0,0,400).update()

                this.chilos = _.map(this.$stage.children, (c, i)=> {
                    c.style.position = 'absolute'
                    Sprite3D.create(c)
                        .origin('center')

                    const PI = 3.14159265357
                    const phi = i*1.4// * 3.14159265357

                    const poscale = [150, 80]

                    const pos = [Math.sin(phi)*poscale[0], Math.cos(phi)*poscale[1], -(i)*300+145]
                    // trace(i, (phi/PI*180)|0,  pos)

                    c.scale(.5) // a special hack to be able to draw sprites that are bigger than the screen withoun being cropped. this scale is compensated by adding extra translation by Z coord
                    c.position(...pos)
                    // if(c.classList.contains('pic'))
                    //     c.scale(.25)
                    c.update()

                    return [c, pos]
                })

                // this.setPoint(-5)

                // const run = ()=>{
                //     const ccount = this.$stage.children.length + 2
                //     let cc = 0
                //     setInterval(()=>{
                //         this.setPoint(cc)
                //         cc = (cc+1)%ccount
                //     }, 2000)

                // }

                // run()

                if(this.stageResolver)
                    this.stageResolver(stage)
                
                this.setState({ pre: false })
            })

        }

        if(Modernizr['browser-ie']){
            this.setPoint = async(cc)=>{
                // const stage = await this.getStage()
                // // stage.origin('center')
                // stage.position(0,0,cc*300).update()

                _.each(this.chilos, (ch, i)=> {
                    const [ c, p ] = ch
                    c.position(...[p[0], p[1], p[2] + cc*300])
                    c.update()

                    const d = Math.abs(cc - i)
                    c.style.filter = `blur(${ d*3 }px)`
                    c.style.opacity = Math.max(1-d/3, 0)
                })


            }

        }

        this.renderExpr('current', current, v=>this.setState({ current: v|0 }))

    }

    async getStage(){
        if(!this.stage){
            await new Promise((resolve, reject)=>{
                        this.stageResolver = resolve
                  })
            this.stageResolver = null
        }

        // trace('got stage', this.stage)

        return this.stage

    }


    async setPoint(cc){
        // trace('waydown setPoint', cc)
        // this.camera.style.visibility = cc > -5 ? 'visible':'hidden'
        const stage = await this.getStage()
        // stage.origin('center')
        stage.position(0,0,cc*300).update()

        _.each(this.$stage.children, (c, i)=> {
            const d = Math.abs(cc - i)
            c.style.filter = `blur(${ d*3 }px)`
            c.style.opacity = Math.max(1-d/4, 0)
        })
    }

    updated(prevProps, prevState){
        trace('Waydown updated', this, this.state.current, prevState.current)
        if(prevState.current != this.state.current)
            this.setPoint(this.state.current||0)
    }

}

export default Waydown