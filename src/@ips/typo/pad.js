export function zeroPad(n,length){
    var s=n+"",needed=length-s.length;
    if (needed>0) s=(new Array(needed + 1).join('0'))+s;
    return s;
}
