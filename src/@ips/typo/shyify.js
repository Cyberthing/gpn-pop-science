var RusA = "[абвгдеёжзийклмнопрстуфхцчшщъыьэюя]";
var RusV = "[аеёиоуыэю\я]";
var RusN = "[бвгджзклмнпрстфхцчшщ]";
var RusX = "[йъь]";

var re1 = new RegExp("("+RusX+")("+RusA+RusA+")","ig");
var re2 = new RegExp("("+RusV+")("+RusV+RusA+")","ig");
var re3 = new RegExp("("+RusV+RusN+")("+RusN+RusV+")","ig");
var re4 = new RegExp("("+RusN+RusV+")("+RusN+RusV+")","ig");
var re5 = new RegExp("("+RusV+RusN+")("+RusN+RusN+RusV+")","ig");
var re6 = new RegExp("("+RusV+RusN+RusN+")("+RusN+RusN+RusV+")","ig");

var shy = "$1\xAD$2"

export function shyify (text){
    text = text.replace(re1, shy);
    text = text.replace(re2, shy);
    text = text.replace(re3, shy);
    text = text.replace(re4, shy);
    text = text.replace(re5, shy);
    text = text.replace(re6, shy);
    return text;
}

export function syllabify (text){
    return shyify(text).split('\xAD')
}
