import React from 'react'
import ReactDOM from 'react-dom/client'
import Main from '../main'
// import store from './store'
// import './interfaz'

export default {
    async init(data = {}){
        return (container, opts)=>{
            // Create a root.
            const root = ReactDOM.createRoot(container);

            if (container.hasChildNodes()) {
                root.hydrate(<Main delay={ 300 } container={ container } locale={ opts.locale } mountData={ opts } {...data}/>);
            } else {
                root.render(<Main delay={ 300 } container={ container } locale={ opts.locale } mountData={ opts } {...data}/>);
            }
        }
    }
}
