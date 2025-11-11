const loadScriptCb = (url, cb)=>{
  const el = document.createElement('script')
  document.head.appendChild(el)
  el.setAttribute('type', 'text/javascript')
  el.async=!0;
  el.src = url
  el.addEventListener('load', cb)
  el.addEventListener('error', err=>console.error(err))
}

const initFbq = ()=>{
  if(window.fbq)
    return;
  const n=window.fbq=function(){
    // trace('indira pochemuchkina')
    n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)
  };
  // trace('kilogramm soplei')

  if(!window._fbq)
    window._fbq=n;

  n.push=n;
  n.loaded=!0;
  n.version='2.0';
  n.queue=[];
}

export default (fbid)=>{
  initFbq()

  loadScriptCb('https://connect.facebook.net/en_US/fbevents.js', ()=>{

    fbq('init', fbid);
    fbq('track', 'PageView');

  })
}
