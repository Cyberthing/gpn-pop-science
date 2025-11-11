import EventEmitter from '@ips/app/event-emitter.js'

window.Sizer = window.Sizer||{}
const Modernizr = window.Modernizr

function wsx(){
    var w = window,
    d = document,
    e = d.documentElement,
    g = d.getElementsByTagName('body')[0];
    return //w.innerWidth ||  // thats wrongish cuz it measures the size of the content that can be bigger that the screen
        e.clientWidth || g.clientWidth;
}

const ws = ()=>{
    var w = window,
    d = document,
    e = d.documentElement,
    g = d.getElementsByTagName('body')[0],
    x = e.clientWidth || g.clientWidth,
    y = e.clientHeight|| g.clientHeight;

    // trace('carawang', x,y)

    // trace('ws', w.innerWidth, e.clientWidth, g.clientWidth)
    return { x:x, y:y };
}

var sizes = [
    768,
    1024,
    1344,
    1440,
]

var names = [
    'screen-size-mobile',
    'screen-size-small',
    'screen-size-regular',
    'screen-size-large',
    'screen-size-extralarge',
]

var oNames = [
    'screen-orientation-landscape',
    'screen-orientation-portrait',
]

function init(s, n, mountData, opts={}){
    const { newCurrent = false, getSize = ws, applyTo = document.documentElement, resetGlobal = true } = opts

    // trace('Sizer.init', s, n, newCurrent, applyTo, resetGlobal)

    const current = newCurrent  ? {
        ee: new EventEmitter(),
        curSize:-1,
        curOrientation:-1,
        curRvw:-1
    } : init
    current.update = ()=>update(current, getSize, applyTo)
    current.destroy = ()=>window.removeEventListener('resize', current.update)

    if(resetGlobal){
        init.curOrientation = -1
        init.curSize = -1
        init.curRvw = -1

        setListedClass(document.documentElement, names, '')
        setListedClass(document.documentElement, minwNames, '')
        window.removeEventListener('resize', gupdate)
        for(var i = 0; i < names.length; i++){
            document.documentElement.classList.remove(names[i])
        }
        for(var i = 0; i < oNames.length; i++){
            document.documentElement.classList.remove(oNames[i])
        }
    }

    if(s)
        sizes = s;
    if(n)
        names = n;

    setTimeout(()=>updateMountVars(mountData), 100)
    current.update()
    window.addEventListener('resize', current.update)
    return current
}

init.curSize = -1;
init.curOrientation = -1
init.curRvw = -1;
init.ee = new EventEmitter()
//trace('sizer init', init)

init.sizes = ()=>sizes
init.names = ()=>names
init.oNames = ()=>oNames

const minwNames = [
    'screen-minw-1440',
    'screen-minw-1152',
    'screen-minw-960',
    'screen-minw-768',
    'screen-minw-350',
]

const minwSizes = [
    1440,
    1152,
    960,
    768,
    350,
]

const setCssVars = (getSize, applyTo)=>{
    // let vh = window.outerHeight * 0.01;
    // let vh = window.innerHeight * 0.01;
    // let vw = window.innerWidth * 0.01;
    const width = getSize().x - (Modernizr['platform-windows'] ? 17:0)
    let rvw = Math.min(width,1440) * 0.01;
    // Then we set the value in the --vh custom property to the root of the document
    // document.documentElement.style.setProperty('--vh', `${vh}px`);
    // document.documentElement.style.setProperty('--vw', `${vw}px`);
    if(init.curRvw != rvw){
        applyTo.style.setProperty('--rvw', `${rvw}px`);
        init.curRvw = rvw
    }
}

const setListedClass = ($el, list, cl)=>{
    for(var i = 0; i < list.length; i++){
        $el.classList.remove(list[i])
    }
    if(cl)
        $el.classList.add(cl)
}

function update(current = init, getSize = ws, applyTo = document.documentElement){
    try{
    window.Sizer = window.Sizer||{}

    var s = getSize()
    // trace('Sizer.update', s, current, getSize, applyTo)
    // trace('Sizer.update', sizes, names)

    setCssVars(getSize, applyTo)

    var ncur = (function(){
        for(var i = 0; i < sizes.length; i++){
            if(s.x < sizes[i]){
                return i;
            }
        }
        return sizes.length; // use the biggest one if it's bigger
    })()
    // trace('ncur', ncur)

    if(ncur != current.curSize){
        const oldName = names[current.curSize]
        const newName = names[ncur]

        current.curSize = ncur;
        current.curSizeName = newName;

        for(var i = 0; i < names.length; i++){
            applyTo.classList.remove(names[i])
        }
        applyTo.classList.add(newName)
        // trace('current', current)
        current.ee.fire('size', [ ncur, newName ])
    }

    var minw = (function(){
        for(var i = 0; i < minwSizes.length; i++){
            if(s.x >= minwSizes[i]){
                return i;
            }
        }
        return minwSizes.length; // use the biggest one if it's bigger
    })()

    if(current.curMinw != minw){
        current.curMinw = minw
        setListedClass(applyTo, minwNames, minwNames[minw])
    }

    // orientation
    const o = (s.x >= s.y) ? 0 : 1;
    // trace('o', o)
    if(current.curOrientation != o){
        const oldName = oNames[current.curOrientation]
        const newName = oNames[o]

        applyTo.classList.remove(oldName)
        window.Sizer[oldName] = false

        current.curOrientation = o
        current.curOrientationName = newName
        applyTo.classList.add(newName)
        window.Sizer[newName] = true

        // trace('Sizer.orientation', newName)

        current.ee.fire('orientation', [ o, newName ])
    }
}catch(err){
    error('Sizer.update', err)
}

}

update()

const gupdate = ()=>update()
window.addEventListener('resize', gupdate)

if((Modernizr && Modernizr['platform-mobile']) || document.documentElement.classList.contains('platform-mobile')){
    setTimeout(update, 3000)
    window.addEventListener('load', gupdate)
    document.addEventListener('ready', gupdate)
}

const updateMountVars = (mountData={}, applyTo = document.documentElement)=>{
try{

    // if(mountData.layoutArticle){
        if(document.body.classList.contains('m-width1440')){
            Modernizr['ria-width-1440'] = true
            Modernizr['ria-width-max'] = false
            applyTo.classList.add('ria-width-1440')
        }
        else
        if(document.body.classList.contains('m-width-max')){
            Modernizr['ria-width-1440'] = false
            Modernizr['ria-width-max'] = true
            applyTo.classList.add('ria-width-max')
        }
    // }

}catch(err){
    error('Sizer.updateMountVars', err)
}


}

export const Sizer = init

export default init