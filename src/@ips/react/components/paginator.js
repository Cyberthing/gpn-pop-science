import React from 'react'
import Base from './base'
import { parseParams } from '@ips/app/parse-params'
import { requestUrl } from '@ips/app/resource'
import EventEmitter from '@ips/app/event-emitter'

import _ from 'lodash'

import { getFullOffsetTop } from '@ips/app/dom-utils'

import './paginator.styl'

export class Paginator extends Base {

    recalc(props, state, force){
        let cprops = super.recalc(props, state, force)

        const { icons, navPoints, navigate, count, className, children } = props
        cprops.icons = _.map(parseParams(icons||''), i => requestUrl(i, 'image'))
        cprops.navPoints = parseParams(navPoints||'')

        const kadrovichok = navigate ? i => {
            this.ee.fire('click', { index: i })

            // trace('kadro', i, cprops.navPoints[i])

            // TODO: 
            // - app.$root instead of document.body
            // - currentScroll.scrollTo instead of window.scrollTo

            const $to = document.querySelector(cprops.navPoints[i])
            trace('$to', $to, getFullOffsetTop($to))
            if($to)
                window.scrollTo(0, getFullOffsetTop($to))
        }:
            i => this.ee.fire('click', { index: i })

        cprops.tpl = <div ref={ ref => this.$el = ref } className={ `paginator ${ className||'' }` }>
                        { count ?
                            _.times(count||0, i => <div key={ i } data-index={ i+1 } onClick={ kadrovichok.bind(null, i) } style={{ backgroundImage:`url(${ cprops.icons[i] })` }}/>)
                            :
                            _.map(children, (c, i)=><div key={ i } data-index={ i+1 } onClick={ kadrovichok.bind(null, i) }>{ c }</div>)
                        }
                    </div>

        return cprops
    }

    created(){
        super.created()

        trace('pagina', this)

        const { current } = this.props
        this.renderExpr('current', current, v=>this.setState({ current: v|0 }))
    }

    updated(){
        const { current } = this.state
        // trace('paginator current', current)
        // _.each(this.$el.children, (c, i)=>c.classList.toggle('paginator__current', i == current))
        _.each(this.$el.children, e=>e.classList.remove('paginator__current'))
        this.$el.children[current] && this.$el.children[current].classList.add('paginator__current')

    }

    render(){
        const { tpl } = this.cprops
        return  tpl
    }
}

export default Paginator