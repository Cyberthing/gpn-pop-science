import React, { Component } from 'react'
import ReactDOM from 'react-dom'

import './main.styl'

//import Part1 from 'pages/p1'

const MainCritical = p=>{
    const { mode, projectName } = this.props.mountData || {}

    trace('MainCritical.render', this, mode)
    return  <div className={ `app ${projectName||''} mode-${ mode }` }>
                critical content here
            </div>
}

export default (container, opts)=>{
    ReactDOM.render(<MainCritical container={ container } locale={ opts.locale } mountData={ opts }/>, container);
}
