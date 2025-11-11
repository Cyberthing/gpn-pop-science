import React from 'react'
import Base from './base'
import PropTypes from 'prop-types';
import { addComputedProps } from './utils/computed-props'
import './slice.styl'

export class Slice extends Base{

    recalc(props, state){
        const { className, width, height, align } = props;
        let { style } = props
        const contHeight = height ? { height } : {}

        const cstyle = height ? { height } : {}

        return {
            fullClassname: `slice ${ className||'' }`,
            contClassname: `slice__sec ${ 'width' + (width||12) } ${ align ? 'align-' + align : 'align-center' }${ height ? ' table':'' }`,
            style: { ...style, ...cstyle },
            contStyle: { ...contHeight }
        }
    }

    render(){
        const { children } = this.props
        const { fullClassname, contClassname, style, contStyle } = this.cprops

        return <div className={ fullClassname } style={ style }>
                    <div className={ contClassname } style={ contStyle }>
                        { children }
                    </div>
                </div>
    }
}

Slice.propTypes = {
    style: PropTypes.object,
    className: PropTypes.string,
    height: PropTypes.string,
    width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    align: PropTypes.string,
}

Slice.defaultProps = {
    style: {},
    className: null,
    height: null,
    width: 12,
    align:'center',
}

export default Slice