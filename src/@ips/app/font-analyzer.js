const FontAnalyzer = {
    lengths: {},
    mappedLengths: {},
}

trace('FontAnalyzer', FontAnalyzer)

const alphaEn = 'abcdefghijklmnopqrstuvwxyz'
const alphaEnU = alphaEn.toUpperCase()
const alphaRu = 'абвгдеёжзийклмнопрстуфхцчшщъыьэюя'
const alphaRuU = alphaRu.toUpperCase()
const etcRu = '№«»'
const etc = '0123456789~!@#$%^&*()_-+={}[];\':\"|<>?,./\\` ' + "\u00A0"//String.fromCharCode(160) //  &nbsp;
const all = [alphaEn, alphaEnU, alphaRu, alphaRuU, etcRu, etc].join()


const getNom = (f = {}) => [f.fontFamily||'?', f.fontSize||'?', f.fontWeight||'?', f.fontStyle||'?'].join('-')

var computeLengths =  f => {
    const e = document.createElement('span')
    e.style.position = 'absolute'
    e.style.top = 0
    e.style.left = 0
    e.style.visibility = 'hidden'
    document.body.appendChild(e)
    Object.assign(e.style, f)
    // trace('thatsme', e)
    const l = new Array(all.length)
    let s = 0
    for(var i = 0; i < all.length; i++){
        e.innerText = all[i]
        l[i] = e.offsetWidth
        s += e.offsetWidth
    }
    l[l.length-2] = l[l.length-1] // fix space length

    // save average just in case
    l['average'] = (s/all.length)|0

    // trace('andmelengths', l)

    return l
}

var computeMap = l =>{
    const m = {}   
    for(var i = 0; i < all.length; i++)
        m[all[i]] = l[i]
    m['average'] = l['average']
    return m;
}

export var getLetterMap = all

export var getLengths = f =>{
    const nom = getNom(f)
    if(!FontAnalyzer.lengths[nom])
        FontAnalyzer.lengths[nom] = computeLengths(f)    
    return FontAnalyzer.lengths[nom]
}

export var getMappedLengths = f =>{
    const nom = getNom(f)
    if(!FontAnalyzer.lengths[nom])
        FontAnalyzer.lengths[nom] = computeLengths(f)    
    if(!FontAnalyzer.mappedLengths[nom])
        FontAnalyzer.mappedLengths[nom] = computeMap(FontAnalyzer.lengths[nom])
    return FontAnalyzer.mappedLengths[nom]
}
