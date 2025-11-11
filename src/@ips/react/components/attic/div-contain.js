import React from 'react'
import Base from './base'

export class DivContain extends Base{

    created(){
        super.created()

        const { aspect } = this.props

        trace('div-contain', this)

        if(aspect == 'auto'){
            this.refs.content.style.width = '1000px'
            this._aspect = this.$content.offsetHeight/this.$content.offsetWidth
            this.refs.content.style.width = ''
        }else
            this._aspect = +aspect

        this.onResize()

        window.addEventListener('resize', this.onResize)
    }

    onResize = ()=>{
        var paspect = this._aspect;

        const naspect = this.$el.offsetHeight / this.$el.offsetWidth
        trace('Contain.onResize', naspect)
        if(naspect < paspect){
            const w = naspect/paspect
            // this.set({ conStyle:`left:${ (1-w)*50 }%;width:${ w*100 }%;height:100%` })
            this.setState({ conStyle: { width:`${ w*100 }%`, height:`100%` }})
        }else{
            const h = paspect/naspect
            // this.set({ conStyle:`top:${ (1-h)*50 }%;width:100%;height:${ h*100 }%` })
            this.setState({ conStyle:{ width:`100%`, height:`${ h*100 }%` }})
        }
    }

    render(){
        const { children } = this.props
        const { conStyle } = this.state

        const p = this.props
        const s = this.state

        return  <div ref={ ref => this.$el = ref } className={ 'div-contain ' + (s.className||p.className||'') }>
                    <div ref={ ref => this.$content = ref } className="div-contain--content" style={ conStyle }>
                        { children }
                    </div>
                </div>
    }
}

export default DivContain