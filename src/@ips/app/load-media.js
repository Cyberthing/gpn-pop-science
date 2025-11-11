function errorLoadingMedia(response) {
    if (!response.ok) {
        throw Error(response.statusText);
    }
    return response;
}

export const loadVideo = (file, $el = document.body)=>new Promise((resolve, reject)=>{
  // trace('loadVideo', file)
  let video = document.createElement('video');

  $el.appendChild(video)
  // video.style.display='none'
  video.style.visibility='hidden'
  // video.style.opacity=0
  video.style.position='absolute'

  video.autoplay = true;
  video.muted = true;
  video.loop = true;
  video.src = file;
  video.load();
  const h = ()=>{
    video.removeEventListener('canplay', h)
    video.play().then(()=>{
      setTimeout(()=>{
        video.pause()
        $el.removeChild(video)
        resolve(true)
      },0)
    })
  }
  video.addEventListener('canplay', h)
  video.onerror = ()=>resolve(false)

})

export const loadImage = (file, $el = document.body)=>new Promise((resolve, reject)=>{
  let img = new Image();
  $el.appendChild(img)

  img.style.visibility='hidden'
  img.style.position='absolute'

  img.src = file;
  // img.onload = resolve
  // img.onerror = reject
  img.onload = ()=>{
    $el.removeChild(img)
    resolve(true)
  }
  img.onerror = ()=>resolve(false)

})

export const loadJson = file=>fetch(file).then(errorLoadingMedia).then(res=>res.json()).catch(e=>{ error('loadJson', e.toString(), file) })

// TODO
export const loadMedia = file=>fetch(file).then(res=>res.json())

// /**
//  * @method loadMedia()
//  * @param {String} name
//  * @param {String} file
//  * @param {Headers} headers 
//  * loads Audio, Video or media blobs
//  */
// LoaderJS.prototype.loadMedia = function (name, file, headers) {
//   this._increaseCount();
//   fetch(file, headers)
//     // .then(res => this._validateResponse(res))
//     .then(res => res.blob())
//     .then(data => {
//       this.assets[name] = URL.createObjectURL(data);
//       this.resCount--;
//       this._checkReady();
//     })
//     .catch(err => {
//       console.error(err, 'file - ' + name + ' , URL ' + file)
//     });
// }
