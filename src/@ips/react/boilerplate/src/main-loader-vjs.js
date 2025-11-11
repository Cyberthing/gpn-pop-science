import Loadable from './loadable-vjs'
// const Spinner = ()=><div>Loading....</div>
// import Spinner from './gooey-spinner-vjs'
import app from '@ips/app/app'

window.__ips_public_path__ = window.__ips_public_path__ || '/'

import * as Critical from './critical'

export default  {
    render: Loadable({
                // prerender: Spinner,
                prerender: (container, opts)=>{
                    trace('prerender critical')

                    if(Critical && Critical.html){
                        container.innerHTML = Critical.html(app.publicPath)
                        const $el = container.children[0]

                        const style = document.createElement('style')
                        style.innerText = Critical.css
                        $el.appendChild(style)
                        return {
                            loaded:()=>container.removeChild($el)
                        }
                    }
                },
                loader: async ()=>{
                    // await new Promise(()=>{})
                    trace('app.publicPath', app.publicPath)
                    trace('__ips_public_path__', __ips_public_path__)
                    // trace('__webpack_public_path__ 0', __webpack_public_path__)
                    __webpack_public_path__ = __webpack_public_path__ || (app.publicPath + '/')
                    const mainBundlePromise = import(/* webpackChunkName: "maindrd" */'main-bundle-rdom')
                    trace('__webpack_public_path__ 1', __webpack_public_path__)
                    // trace('mainBundlePromise', mainBundlePromise)
                    const res = await mainBundlePromise
                    // trace('res', res)
                    const MainBundle = res.default
                    // trace('MainBundle', MainBundle)
                    const MainCompo = await MainBundle.init()
                    trace('MainCompo', MainCompo)

                    trace('__webpack_public_path__ 2', __webpack_public_path__)

                    // const prelo = document.createElement('div')
                    // prelo.style.display = 'none'
                    // document.body.appendChild(prelo)
                    // await new Promise((resolve, reject)=>document.addEventListener('load', resolve))
                    // await new Promise((resolve, reject)=>setTimeout(resolve, 100000000))
                    
                    return MainCompo
                },
                render(Loaded, container, opts) {
                    trace('loadable render with props', Loaded, container, opts)
                    // let Component = loaded
                    return Loaded(container, opts)
                }
            })
}