import React from 'react'
import Base from 'components/base'
import Fixed from 'components/fixed'
import Clickable from 'components/clickable'
import ShowHide from 'components/show-hide'

import './lightbox.styl'

// this thing manages global scroll at the moment
class LightboxMan{
    toggle(state){
        if(state){
            document.documentElement.style.overflowY = 'hidden'
        }else
            document.documentElement.style.overflowY = ''
    }
}

const lightboxMan = new LightboxMan()

export class Lightbox extends Base {

    recalc(props, state, force){
        let cprops = super.recalc(props, state, force)

        return cprops
    }

    render(){
        const { children, name, className } = this.props
        const { visible } = this.state
        return  <ShowHide reduce visible={ visible } animTime="0.5">
                    <Fixed cover className={`lightbox ${ className||'' }`}>
                        <div ref={ ref=> this.$container = ref } className="lightbox__container">
                            <div className="lightbox__frame">
                                { children }
                            </div>
                        </div>
                        <Clickable name={ name + '_close' } className="lightbox__btn-close"/>
                    </Fixed>
                </ShowHide>
    }

    created(){
        super.created()

        const { name, show } = this.props
        this.renderExpr('show', show, v=>this.setState({ show:v }))
        this.renderExpr('hide', `expr event('${ name + '_close' }', 'click')`, v=>this.setState({ hide:v }))

        //trace('lightbox', this)
    }

    updated(prevProps, prevState){
        const { show, hide, visible } = this.state

        // trace('open close', this, this.state )

        if(show){
            this.$container.scrollTop = 0   // reset the scroll
            this.setState({ show: false, visible:true })
            lightboxMan.toggle(true)
        }

        if(hide){
            this.setState({ hide: false, visible:false })
            setTimeout(()=>lightboxMan.toggle(false), 500)
        }

    }

}

export default Lightbox