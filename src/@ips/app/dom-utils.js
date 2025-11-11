import * as __ from './hidash.js'

export function getFullOffsetTop (elem, relativeTo){
    // jsperf: loopedOffsetOptimized3
    relativeTo = relativeTo||document.documentElement;
    var offsetTop = 0
        , lastElem = elem;

    // trace('getFullOffsetTop', this, relativeTo)

    while (true) {
        // trace(elem)
        if (elem === relativeTo || !elem) { //from my observation, document.body always has scrollLeft/scrollTop == 0
            break;
        }
        offsetTop += elem.offsetTop  // - elem.parentElement.scrollTop; // disabled local scrolls
        // trace('epa', elem, elem.offsetTop, elem.parentElement.scrollTop, offsetTop)
        lastElem = elem;
        elem = elem.offsetParent;
    }

    if (elem != relativeTo){
        // offsetTop -= relativeTo.scrollTop;
        offsetTop -= getFullOffsetTop(relativeTo, elem)
    }

    // if (lastElem && lastElem.style.position === 'fixed') { //slow - http://jsperf.com/offset-vs-ge tboun dingclie ntrect/6
    //     //if(lastElem !== document.body) { //faster but does gives false positive in Firefox
    //     offsetTop += window.pageYOffset || document.documentElement.scrollTop;
    // }
    // trace('ended with', elem, offsetTop)

    return offsetTop
};

export function getFullOffsetLeft (elem, relativeTo){
    // jsperf: loopedOffsetOptimized3
    relativeTo = relativeTo||document.documentElement;
    var offsetLeft = 0
        , lastElem = elem;

    // trace('getFullOffsetLeft', this, relativeTo)

    while (true) {
        // trace(elem)
        if (elem === relativeTo || !elem) { //from my observation, document.body always has scrollLeft/scrollTop == 0
            break;
        }
        offsetLeft += elem.offsetLeft  // - elem.parentElement.scrollTop; // disabled local scrolls
        // trace('epa', elem, elem.offsetTop, elem.parentElement.scrollTop, offsetLeft)
        lastElem = elem;
        elem = elem.offsetParent;
    }

    if (elem != relativeTo){
        // offsetTop -= relativeTo.scrollTop;
        offsetLeft -= getFullOffsetLeft(relativeTo, elem)
    }

    // if (lastElem && lastElem.style.position === 'fixed') { //slow - http://jsperf.com/offset-vs-ge tboun dingclie ntrect/6
    //     //if(lastElem !== document.body) { //faster but does gives false positive in Firefox
    //     offsetTop += window.pageYOffset || document.documentElement.scrollTop;
    // }
    // trace('ended with', elem, offsetTop)

    return offsetLeft
};


export function parseOffset(ofs, boxHeight, ws){
    // trace('parseOffset', ofs, boxHeight)
    if(__.isString(ofs)){
        ofs = ofs.trim()
        if(ofs.substr(-2) == 'px')
            return parseInt(ofs.substr(0, ofs.length - 2))
        else
        if(ofs.substr(-2) == 'vh'){
            if(!ws)
                ws = windowSize()
            return parseInt( (+ofs.substr(0, ofs.length - 2) * ws.y / 100) | 0)
        }
        else
        if(ofs.substr(-1) == '%'){
            return parseInt( (+ofs.substr(0, ofs.length - 1) * boxHeight / 100) | 0)
        }else
        if(ofs == 'center'){
        }else
        if(ofs == 'top'){
        }else
        if(ofs == 'bottom'){
        }else{
            return parseInt( ofs ) || 0
        }
    }else
    if(__.isNumber(ofs)){
        return ofs
    }
    return 0;
}

// export function windowSize(){
//     var w = window,
//     d = document,
//     e = d.documentElement,
//     g = d.getElementsByTagName('body')[0],
//     x = 
//         //w.innerWidth ||  // thats wrongish cuz it measures the size of the content that can be bigger that the screen
//         e.clientWidth || g.clientWidth,
//     y = 
//         //w.innerHeight|| 
//         e.clientHeight|| g.clientHeight;
//     // trace('ws.x', w.innerWidth, e.clientWidth, g.clientWidth)
//     return { x, y };
// }

export function windowSize(){
    return { x:window.innerWidth, y:window.innerHeight };
}



export function windowScrollY() { return document.documentElement.scrollTop || document.body.scrollTop || window.pageYOffset }

export function loadImages(imageURLs =[]){
    return new Promise((resolve, reject)=>{
        var imagesOK=0;
        var imgs=[];
        loadAllImages();

        function loadAllImages(){
            for (var i = 0; i < imageURLs.length; i++) {
              var img = new Image();
              imgs.push(img);
              img.onload = function(){ imagesOK++; imagesAllLoaded(); };
              img.src = imageURLs[i];
            }      
        }

        var imagesAllLoaded = function() {
          if (imagesOK==imageURLs.length ) {
             resolve(imgs)
          }
        }    
    })
}

export function applyAnimation(e, a){
    const s = e.style
    s.animationName = a.name
    s.animationDuration = a.duration || '1s'
    s.animationDelay = a.delay || ''
    s.animationFill = a.fill || 'both'
    s.animationTimingFunction = a.ease || 'linear'
}

export const findAncestor = (e, p)=>{
    while(e){
        const r = p(e)
        if(r)
            return r
      e = e.parentElement
    }
}

export function getScrollbarWidth() {
  var outer = document.createElement("div");
  outer.style.visibility = "hidden";
  outer.style.width = "100px";
  outer.style.msOverflowStyle = "scrollbar"; // needed for WinJS apps

  document.body.appendChild(outer);

  var widthNoScroll = outer.offsetWidth;
  // force scrollbars
  outer.style.overflow = "scroll";

  // add innerdiv
  var inner = document.createElement("div");
  inner.style.width = "100%";
  outer.appendChild(inner);        

  var widthWithScroll = inner.offsetWidth;

  // remove divs
  outer.parentNode.removeChild(outer);

  return widthNoScroll - widthWithScroll;
}