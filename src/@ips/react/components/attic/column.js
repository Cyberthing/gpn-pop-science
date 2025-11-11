import React from 'react';
import Base from './base';
import PropTypes from 'prop-types';
import './column.styl'

export class Column extends Base{
    recalc(props, state){
        const { className, width, left, right, mode } = props;
        return {
            classNameMain:`column ${ width ? ` width${ width }`:'' } ${ left ? ` left${ left }`:'' } ${ right ? ` right${ right }`:'' } ${ mode ? ` mode-${ mode }`:'' } `,
        }
    }

    render(){
        const { classNameMain } = this.cprops

        const p = this.props
        const s = this.state

        return <div ref={ref=>this.$el=ref} className={ classNameMain + (s.className || p.className || '') } style={ p.style }>
                    { p.children }
                </div>
    }
}

Column.propTypes = {
    style: PropTypes.object,
    className: PropTypes.string,
    mode: PropTypes.string,
    left: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    right: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    // align: PropTypes.string,
}

Column.defaultProps = {
    addStyle: {},
    className: null,
    left: 0,
    width: 0,
    // align:'center',
}

export default Column