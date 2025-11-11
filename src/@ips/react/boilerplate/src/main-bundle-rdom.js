import React from 'react'
import ReactDOM from 'react-dom'
import Main from './main'
// import store from './store'
// import './interfaz'

export default {
    async init(){
        trace('init')
        return (container, opts)=>{
            if (container.hasChildNodes()) {
                ReactDOM.hydrate(<Main delay={ 300 } container={ container } locale={ opts.locale } mountData={ opts }/>, container);
            } else {
                ReactDOM.render(<Main delay={ 300 } container={ container } locale={ opts.locale } mountData={ opts }/>, container);
            }
        }
    }
}
