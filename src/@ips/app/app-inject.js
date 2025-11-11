import { 
    trimTrailingSlashes,
    trimPathFilename,
    pathRHead,
    pathRTail,
    getParamsFromUrl,
    findAncestor,
    findArr,
    strIncludes
} from './app-inject-utils.js'

export default (render, opts) => {

    const currentScript = 
        findArr(document.querySelectorAll('script[data-uid]'), 
            s => strIncludes(s.src, 'ria.ru/ips/')&&!s.getAttribute('data-ips-bound') ? s : null)
        || document.currentScript 

    // console.log('currentScript', currentScript)

    if(currentScript)
        currentScript.setAttribute('data-ips-bound', true)

    const containerUid = currentScript && (currentScript.getAttribute('data-uid')||getParamsFromUrl(currentScript.src)['uid'])
    const containerShape = findAncestor(currentScript, e => strIncludes(e.className, 'mod-shape-') ? findArr(e.classList, c=>c.startsWith('mod-shape-') ? c : null) : null) || 'none'
    const layoutArticle = findAncestor(currentScript, e => e.classList.contains('layout-article') ? e : null)
    const injectAsInfographics = findAncestor(currentScript, e => e.classList.contains('article__infographics'))
    const endlessItem = findAncestor(currentScript, e => e.classList.contains('endless__item') ? e : null)
    const scriptName = currentScript && pathRHead(currentScript.src.split('?')[0].split('#')[0])
    const siteRia = document.body.classList.contains('m-ria')
    const hostRia = location.host == 'ria.ru'

    const qparams = currentScript ? (currentScript.src.split('?')[1] || currentScript.baseURI.split('?')[1]) : ''
    // const qparams = currentScript ? currentScript.baseURI.split('?')[1] : ''
    const qps = qparams?.split('#')||[]
    const searchParams = qps[0]
    const hash = qps[1]||''

    const publicPath = currentScript ? pathRTail(currentScript.src) : (location.origin + trimTrailingSlashes(trimPathFilename(location.pathname)))
    // console.log('appInject:publicPath', publicPath)

    if(!window['__ips_app_location__'])
        window.__ips_app_location__ = publicPath

    // TODO: solve this somehow for multiple apps on one page ( it is only important for dynamic import() )
    window.__webpack_public_path__ = publicPath + '/'

    const rootElt = (currentScript && currentScript.parentElement) || document.querySelector('#ips-root') || document.body

    const container = document.createElement('div')
    container.className = 'ips-app-container'
    rootElt.appendChild(container)

    const xopts = {
        currentScript,
        currentScriptSrc:currentScript?currentScript.src:undefined,
        searchParams,
        hash,
        publicPath,
        scriptName,
        project: pathRHead(trimTrailingSlashes(publicPath)),
        siteRia,
        hostRia,
        containerUid,
        containerShape,
        layoutArticle,
        injectAsInfographics,
        endlessItem,
        ...opts
    }
    console.log('mounting app', xopts, 'at', container)
    render(container, xopts)
}
