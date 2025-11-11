export function xhrGetText(url, cb){
    var oReq = new XMLHttpRequest()
    oReq.onreadystatechange = function(){
        if (this.readyState == 4 && this.status == 200) {
            cb(oReq.responseText)
        }
    }
    // oReq.addEventListener("load", res=>cb(res))

    oReq.open("GET", url)
    oReq.send()
}
