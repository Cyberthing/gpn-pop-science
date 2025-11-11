var POST_EXCUSES = ["мы", "она", "они", "оно", "я", "что", "все", "без", "безо", "близ", "в", "во", "вместо", "вне", "для", "до", "за", "из", "изо", "из-за", "из-под", "к", "ко", "кроме", "между", "меж", "на", "над", "надо", "о", "об", "обо", "от", "ото", "перед", "передо", "пред", "предо", "по", "под", "подо", "при", "про", "ради", "с", "со", "у", "через", "чрез", "так", "и", "да", "не", "но", "тоже", "ни", "зато", "однако", "же", "либо", "то", "ли", "а", "я", "он"];

var UNUSED = ["также", "или", "сквозь"]

var PREV_EXCUSES = ["века", "в.", "год", "г.", "года", "—", "–", "-"];

// Array.prototype.subarray=function(start,end){
//      if(!end){ end=-1;} 
//     return this.slice(start, this.length+1-(end*-1));
// }

// function subarray(arr, start,end){
//      if(!end){ end=-1;} 
//     return arr.slice(start, arr.length+1-(end*-1));
// }

const indexOf = (arr, s)=>{
    return arr.indexOf(s)
}

export function carryUnions (text) {
    var words = text.replace(/ +(?= )/g,'').replace(/></g, "> <").split(" ");
    text = '';

    words.forEach(function(word, i) {
        word = word.replace(/[,;:!?()"]/g, '').replace(/<.*?>/gi, '').toLowerCase();
        var space = "";

        if (indexOf(POST_EXCUSES, word) != -1) {
            text += words[i];
            space = "\u00A0";
        } else if(indexOf(PREV_EXCUSES, word) != -1 && i) { // skip if it is a first word in the text
            text = text.substr(0, text.length - 1) + "\u00A0" + words[i];
            space = " ";
        } else {
            text += words[i];
            space = " ";
        }
        if(i < (words.length - 1)) {
            text += space;
        }
    });

    return text;
}

export function reCarryUnions(elt){
    [...elt.childNodes].forEach((d)=>{ 
        if (d.nodeType == 3){
            d.textContent = carryUnions(d.textContent);
        }
        else
            reCarryUnions(d);
    })
}
