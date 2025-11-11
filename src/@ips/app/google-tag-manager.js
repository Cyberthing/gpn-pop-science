
// let dataLayerName = 'ipsDataLayer'
let dataLayerName = 'dataLayer'
let dataLayer = window[dataLayerName]||[]
window[dataLayerName] = dataLayer;

if(!document.querySelector('script#ips-gtm'))
(function(w,d,l,i,id){
    w[l]=w[l]||[];
    w[l].push({'gtm.start': new Date().getTime(),event:'gtm.js'});
    var u='https://www.googletagmanager.com',
        s='script',
        f=d.getElementsByTagName(s)[0], 
        j=d.createElement(s),
        k=d.createElement('noscript'),
        m=d.createElement('iframe'),
        dl=l!='dataLayer'?'&l='+l:'';
    j.async=true;
    j.src=u+'/gtm.js?id='+i+dl;
    j.id=id;
    m.src=u+'/ns.html?id='+i;
    m.height="0"
    m.width="0"
    m.style.cssText="display:none;visibility:hidden"
    k.appendChild(m)
    f.parentNode.insertBefore(j,f);
    f.parentNode.insertBefore(k,j);
})
(window, document, dataLayerName,'GTM-T2NZ6V','ips-gtm');

let defApp = { location: {} };
let app = defApp;

let generalOpts = {}
export function connect(newApp, o = {}){
    app = newApp||defApp
    generalOpts = o
    if(generalOpts.log)
        trace('gtm.connect', app, o)
}

export function post(event){
    // trace('gtm post', event);
    dataLayer.push(event)
}

export function event(event, opts = {}){
try{

    var slideName = ''//slideName = app.location.slide || '';
    var curAnchor = ''//app.location.anchor || '';
    
    var projectName = app.projectName || app.project || 'noname'
    
    var dlEvent = opts;
    dlEvent.event = 'project_events';
    dlEvent.eventCategory = event

    // TODO: extract opts to event label/action
    // TODO: consider general rule dlEvent.eventLabel = opts[event]

    dlEvent.eventLabel = opts[event]

    // if(event == 'anchor'){
    //     dlEvent.eventLabel = opts.anchor
    // }
    // else if(event == 'outer_link'){
    //     dlEvent.eventLabel = opts.outer_link
    // }
    // else if(event == 'inner_link'){
    //     dlEvent.eventLabel = opts.inner_link
    // }

    dlEvent.project = projectName;
    dlEvent.version = app.version || app.appMode
    dlEvent.locale = app.locale
    if(app.chapter_name)
        dlEvent.eventAction = app.chapter_name

    if(generalOpts.log){
        trace('gtm.event', event, dlEvent)
    }

    // if(app.router){
    //     dlEvent.from = app.router.getState().path
    // }
    // 
    // if(event != 'pageview' && 'undefined' != typeof para)
    //     dlEvent[event] = para;
    // 
    // if(event == 'generic'){
    //     dlEvent.object_id = para2;
    // }

    post(dlEvent);
    
}catch(err){
    console.error(err)
}
}
