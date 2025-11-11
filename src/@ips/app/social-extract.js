import { initSocialShares } from './social.js'

// const metap = p=> {
//     var el = document.querySelector(`meta[property='${ p }']`)
//     return el && el.getAttribute('content')
// }
// const metan = p=> {
//     var el = document.querySelector(`meta[name='${ p }']`)
//     return el && el.getAttribute('content')
// }

const metanp = (p, d)=> {
    var el = (d||document).querySelector(`meta[name='${ p }']`)
    if(!el)
        el = (d||document).querySelector(`meta[property='${ p }']`)
    return el && el.getAttribute('content')
}

window.addEventListener('load', ()=>{
    // console.log('loaded', document.querySelectorAll('meta'))
    initSocialShares({
        title: metanp('og:title')||document.querySelector('title').innerText,
        description: metanp('og:description')||metanp('description'),
        url: metanp('og:url')||metanp('twitter:site')||location.href,
        image: metanp('og:image'),
        twTitle: metanp('twitter:title'),
        twDescription: metanp('twitter:description'),
        twUrl: metanp('twitter:site')||metanp('og:url')||location.href,
        twImage: metanp('twitter:image'),
    })
})
