import appInjectEmb from '@ips/app/app-inject.js'
import { loadScriptCb } from '@ips/app/utils.js'

export default render => 
    loadScriptCb('https://ria.ru/ips/lib/ria-app-inject-global.js', err=>{
        // trace('error loading', 'https://ria.ru/ips/lib/ria-app-inject-global.js')
        const appInject = (__ipsGlobal||{}).appInject||appInjectEmb
        appInject(render)
    })
