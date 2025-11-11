import uniqueNumber from '@ips/app/unique-number.js'
import throttle from '@ips/app/throttle.js'
import { ud } from '@ips/app/hidash.js'

export const kebabize = (str) => str.replace(/[A-Z]+(?![a-z])|[A-Z]/g, ($1, ofs) => (ofs ? "-" : "") + $1.toLowerCase())
export const flatRule = (o, comment)=>'\n'+(comment?`  /* ${comment} */\n`:'')+Object.entries(o).map( e =>ud(e[1])?'':`  ${kebabize(e[0])}: ${e[1]};\n`).join('')

export const createStyle = (prefx = '')=>{
    var style = document.createElement('style');
    style.type = 'text/css';
    style.id='style-'+prefx+uniqueNumber()

    const head = document.getElementsByTagName('head')[0]
    head.appendChild(style);

    var raws = {}
    var rawCount = 0
    var rules = {}
    var ruleCount = 0

    const genRules = throttle(()=>_genRules(style, Object.values(rules).filter(Boolean), Object.values(raws).filter(Boolean)),50)

    // const genRules = throttle(()=>{
    //     trace('genRules', raws)
    //     _genRules(style, Object.values(rules).filter(Boolean), Object.values(raws).filter(Boolean))
    // },50)

    return {
        style,

        addRaw: text=>{
            raws[rawCount] = text
            genRules()
            // _addRaw(style, text)

            head.appendChild(style);
            return rawCount++
        },
        removeRaw: id =>{ 
            raws[id] = null 
            genRules()
        },
        modifyRaw: (id, text) =>{ 
            if(!raws[id]) return; 
            raws[id] = text
            genRules()
        },
        addRule:(selector, text) =>{
            // trace('addRule', selector, text)
            const rule = [selector, text]
            rules[ruleCount] = rule
            // _addRule(style, selector, text)
            genRules()

            head.appendChild(style);
            return ruleCount++
        },
        removeRule: id =>{ 
            rules[id] = null 
            // trace('CSSUtils.removeRule')
            // _genRules(style, __.objMap(rules, r=>r), __.objMap(raws, r=>r))
            genRules()
        },
        modifyRule: (id, text) =>{ 
            // trace('CSSUtils.style.modifyRule', id, text)
            if(!rules[id]) return; 
            rules[id][1] = text
            // _genRules(style, __.objMap(rules, r=>r), __.objMap(raws, r=>r))
            genRules()
        },
        destroy:()=>{
            if(style){
                trace('destroyeen', style)
                head.removeChild(style);
                style = null
            }
        }
    }
}

export const genClassName = prefx=>(prefx||'c')+uniqueNumber()

const _genRules = (style, rules, raws) =>{
    // trace('CSSUtils._genRules', rules)
    style.innerHTML = 
        rules.filter(r=>r[1]).map(([selector, rule])=>`${selector} {${rule}}`).join('\n') + 
        raws.filter(Boolean).join('\n')
}

const _addRule = (style, selector, rule) =>{
    style.innerHTML += `${selector} {${rule}}\n`
}

const _addRaw = (style, raw) =>{
    style.innerHTML += raw
}
