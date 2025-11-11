if(!document.querySelector('script#ips-metrika'))
    (function(m,e,t,r,i,k,a,id,cb){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
    m[i].l=1*new Date();k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.id=id,k.onload=cb,k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
    (window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym", null, null, "ips-metrika", ()=>{ __ipsym = window.ym||__ipsym });
// console.log('YMID', __ipsym, YMID)

var defaultYMID = 52449085 // Yandex.Metrika default counter ID

var YMID // 
var vizitParams

function initMetrika(opts){
    opts = opts || {}

    YMID = opts.YMID || defaultYMID

    ym(YMID, "init", {
            id:YMID,
            clickmap:true,
            trackLinks:true,
            accurateTrackBounce:true
    })

    vizitParams =  {
        scriptName: opts.scriptName,
        containerUid: opts.containerUid,
        containerShape: opts.containerShape,
        project: opts.project,
        url: opts.url,
    }

    // ym(YMID, 'params', vizitParams)

    var img = new Image(1, 1)
    img.src = `https://mc.yandex.ru/watch/${ YMID }`
    img.style="position:absolute; left:-9999px"
}

function eventMetrika(name, opts){
    ym(YMID, 'reachGoal', 'e', { ...vizitParams, ...opts, event:name })
}