
var w = (typeof window != 'undefined') ? window : global
if(console && console.log){
    w.info = console.log.bind(w.console);
    w.trace = console.log.bind(w.console);
    w.warn = console.warn.bind(w.console);
    w.error = console.error.bind(w.console);
}else{
    w.info =
    w.trace =
    w.warn =
    w.error = function(){};

    if (!w.console) w.console = {};
    if (!w.console.log) w.console.log = function () { };
}
