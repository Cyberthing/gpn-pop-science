var carryUnions = require('carry-unions');

module.exports = function reCarryUnions(elt){
    [...elt.childNodes].forEach((d)=>{ 
        if (d.nodeType == 3){
            d.textContent = carryUnions(d.textContent);
        }
        else
            reCarryUnions(d);
    }))
}
