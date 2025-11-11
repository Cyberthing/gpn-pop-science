import * as Google from '@ips/app/google-tag-manager.js'
import * as Metrika from '@ips/app/metrika.js'

// const analytics = {
//     event:()=>{}
// }

const objEach = (o, f)=>Object.keys(o||{}).forEach((key)=>f(o[key], key))
const objMap = (o, f)=>Object.keys(o||{}).map((key)=>f(o[key], key))

const q = (url, opts)=>(url + '?' + objMap(opts, (o, k)=>o?(k+'='+o):'').filter(o=>o).join('&'))

// function loadFacebookSDK(){
//   window.fbAsyncInit = function() {
//     FB.init({
//       appId            : '501403387024620',
//       autoLogAppEvents : true,
//       xfbml            : true,
//       version          : 'v3.2'
//     });
//   };
// 
//   (function(d, s, id){
//      var js, fjs = d.getElementsByTagName(s)[0];
//      if (d.getElementById(id)) {return;}
//      js = d.createElement(s); js.id = id;
//      js.src = "https://connect.facebook.net/en_US/sdk.js";
//      fjs.parentNode.insertBefore(js, fjs);
//    }(document, 'script', 'facebook-jssdk'));
// }
// 
// loadFacebookSDK()
//         
function getVK(settings){
    const { url, twUrl, title, twTitle, description, twDescription, image, twImage, vkImage } = settings

    var content = q('https://vk.com/share.php', {
        url:url||twUrl,
        title:(title||twTitle||description||twDescription) ? (title||twTitle+': '+description||twDescription) : '',
        image:vkImage||image||twImage,
        // noparse:1
    })

    // var content = 'https://vk.com/share.php?'
    //     + 'url=' + (settings.url||settings.twUrl)
    //     + '&title=' + (settings.title||settings.twTitle)
    //     + '&description=' + (settings.description||settings.twDescription)
    //     // '&image=' + (settings.vkImage || settings.image || settings.twImage) +
    //     // '&noparse=1'
    window.open(content, 'sharer', 'toolbar=0,status=0,width=626,height=436')
}        
        
function getFB(settings){
    // var content = 'https://www.facebook.com/dialog/feed?app_id=1620278468269325&display=popup' +
    // '&name=' + settings.title +
    // '&description=' + settings.desc +
    // '&link=' + settings.url +
    // '&picture=' + settings.imgUrl;
    
    // // trace('opening fb sharer')
    // window.open(content, 'sharer', 'toolbar=0,status=0,width=548,height=325,resizable=yes');

    // FB.ui({
    //   method: 'share',
    //   href: settings.fbUrl||settings.url||settings.twUrl,
    // }, function(response){})

    window.open(`https://www.facebook.com/sharer.php?u=${settings.fbUrl||settings.url||settings.twUrl}`, 'sharer', 'toolbar=0,status=0,width=626,height=436');
}

function getOK(settings){
    var okUrlR = 'https://connect.ok.ru/offer?' 
        + 'url=' + (settings.url||settings.twUrl) 
        // + '&title=' + (settings.title||settings.twTitle||'') 
        // + '&description=' + (settings.description||settings.twDescription||'') 
        // + '&imageUrl=' + (settings.image || settings.vkImage || settings.twImage)

    window.open(okUrlR, 'sharer', 'crollbars=0,resizable=1,menubar=0,left=100,top=100,width=750,height=440,toolbar=0,status=0')    
}

function getTW(settings){
    var sUrl = 'https://twitter.com/intent/tweet' +
        '?status='
        
    if(settings.twTitle||settings.title){
        sUrl += `&text=${(settings.twTitle||settings.title)}`

        if(settings.twDescription||settings.description)
            sUrl +=  ": " + (settings.twDescription||settings.description)

        sUrl += "%20"
    }

    sUrl += (settings.twUrl||settings.url)

    // trace('getTW', settings, sUrl)
    window.open(sUrl, 'sharer', 'toolbar=0,status=0,width=626,height=436')  
}

function getTG(settings){
    var sUrl = `https://telegram.me/share/url?url=${settings.url}`
    if(settings.twTitle||settings.title){
        sUrl += `&text=${(settings.twTitle||settings.title)}`

        if(settings.twDescription||settings.description)
            sUrl +=  ": " + (settings.twDescription||settings.description)
    }
    window.open(sUrl, 'sharer', 'toolbar=0,status=0,width=626,height=436')  
}

const Sharers = {
    FB: getFB,
    OK: getOK,
    VK: getVK,
    TW: getTW,
    TG: getTG,
}

let gsettings = {}

export const share = (social, opts={})=>{
    const sharer = Sharers[social.toUpperCase()]
    if(!sharer){
        console.warn('unknown sharing target', social)
        return
    }

    sharer({...gsettings, ...opts, fbUrl:opts.url}) // HACK: replacing default fbUrl
    Google.event('social', { social, social_url:opts.url })
    Metrika.event('social', { social, social_url:opts.url })
}

export const initSocialShares = (settings = {})=>{

    console.log('initSocialShares', settings)
    
    // settings = {
    //     title: metap('og:title')||document.querySelector('title').innerText,
    //     description: metap('og:description')||metan('description'),
    //     url: metap('og:url')||location.href,
    //     image: metap('og:image'),
    //     twTitle: metan('twitter:title'),
    //     twDescription: metan('twitter:description'),
    //     twUrl: metan('twitter:url')||location.href,
    //     twImage: metan('twitter:image'),
    // }
  
    const soc_tw = [...document.querySelectorAll('.btn-social-tw')]
    const soc_vk = [...document.querySelectorAll('.btn-social-vk')]
    const soc_fb = [...document.querySelectorAll('.btn-social-fb')]
    const soc_ok = [...document.querySelectorAll('.btn-social-ok')]

    // trace(soc_tw, soc_vk, soc_fb, soc_ok)

    const addBtnClass = (s)=>{
        let clickarea = s.querySelector('.clickarea') || s;
        clickarea.setAttribute('class', clickarea.getAttribute('class') + ' btn')
    }

    soc_tw.forEach(addBtnClass)
    soc_vk.forEach(addBtnClass)
    soc_fb.forEach(addBtnClass)
    soc_ok.forEach(addBtnClass)

    const fbUrl = settings.url||settings.twUrl
    objEach(settings, (val, key)=> settings[key] = val&&encodeURIComponent(val))
    settings.fbUrl = fbUrl

    gsettings = settings

    // _.each(settings, (val, key)=>{
    //     settings[key] = encodeURIComponent(val);
    // });

    // var vkUrlR = 'https://vk.com/share.php' +
    //     '?title=' + settings.title +
    //     '&description=' + settings.desc +
    //     '&url=' + settings.url +
    //     '&image=' + settings.imgUrl +
    //     '&noparse=1';

    var okUrlR = 'https://ok.ru/dk?st.cmd=addShare' +
        '&title=' + (settings.title||settings.twTitle) + ": " + (settings.description||settings.twDescription) +
        '&st._surl=' + (settings.url||settings.twUrl)

    var tUrlR = 'https://twitter.com/intent/tweet' +
        '?status=' + (settings.twTitle||settings.title) + ": " + (settings.twDescription||settings.description) + "%20" + (settings.twUrl||settings.url)

    // var fbUrlR = 'http://www.facebook.com/sharer.php' +
    //     '?s=100&p[title]=' + settings.title +
    //     '&p[summary]=' + settings.desc +
    //     '&p[url]=' + settings.url +
    //     '&p[images][0]=' + settings.imgUrl +
    //     '&t=' + settings.title +
    //     '&e=' + settings.desc;

    soc_fb.forEach(s =>
        s.addEventListener("click", function() {
            Google.event('social', { social:'FB' })
            Metrika.event('social', { social:'FB' })
            getFB(settings)
        })
    )
    
    soc_vk.forEach(s =>
        s.addEventListener("click", function() {
            Google.event('social', { social:'VK' })
            Metrika.event('social', { social:'VK' })
            getVK(settings)
        })
    )

    soc_tw.forEach(s =>
        s.addEventListener("click", function() {
            Google.event('social', { social:'TW' })
            Metrika.event('social', { social:'TW' })
            window.open(tUrlR, 'sharer', 'toolbar=0,status=0,width=626,height=436')
        })
    )

    soc_ok.forEach(s =>
        s.addEventListener("click", function() {
            Google.event('social', { social:'OK' })
            Metrika.event('social', { social:'OK' })
            window.open(okUrlR, 'sharer', 'crollbars=0,resizable=1,menubar=0,left=100,top=100,width=750,height=440,toolbar=0,status=0')
        })
    )
}
