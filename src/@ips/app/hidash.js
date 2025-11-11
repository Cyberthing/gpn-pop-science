export const nop = ()=>{}
export const nul = ()=>null
export const ident = v=>v

export const ud = o=>(typeof o === "undefined")
export const isString = o=>(typeof o === 'string' || o instanceof String)
export const isNumber = o=>(typeof o === 'number' || o instanceof Number)&&(!isNaN(o))
export const isObject = o=>((typeof o === "object") && (o !== null))
export const isArray = o=>Array.isArray(o)
export const isFunction = o=>(typeof o === 'function' || o instanceof Function)
export const isDOMElement = (o)=>(
    typeof HTMLElement === "object" ? o instanceof HTMLElement : //DOM2
    o && typeof o === "object" && o !== null && o.nodeType === 1 && typeof o.nodeName==="string"
)

export const objEach = (o, f)=>{ Object.keys(o||[]).forEach((key)=>f(o[key], key)); return o }
export const objMap = (o, f)=>Object.keys(o||[]).map((key, i)=>f(o[key], key, i))
export const objTransform = (o, f)=>keyBy(Object.keys(o||[]).map( key =>[key, f(o[key], key)]), v=>v[0], v=>v[1])
// TODO export const objFilter = (o, f)=>

export const objEqualShallow = (o1, o2)=>{
    if(!o1 && !o2)
        return true

    if(!o1 || !o2)
        return false

  const entries1 = Object.entries(o1);
  const entries2 = Object.entries(o2);
  if (entries1.length !== entries2.length) {
    return false;
  }
  for (let i = 0; i < entries1.length; ++i) {
    // Keys
    if (entries1[i][0] !== entries2[i][0]) {
      return false;
    }
    // Values
    if (entries1[i][1] !== entries2[i][1]) {
      return false;
    }
  }

  return true;
}



export const arrKeyBy = (array, keyf = v=>v, valf=v=>v) => (array || []).reduce((acc, v, i)=>({ ...acc, [ keyf(v, i) ]:valf(v, i) }), {})
export const arrKey = (array, keyf = v=>v, valf=v=>v) => (array || []).reduce((acc, v, i)=>({ ...acc, [ v[0] ]:v[1] }), {})
export const arrJoin = (...args)=>[].concat.apply([],args)

export const times = (c, f)=>(Array.from({length: c}, (_,x) => f(x)))
export const each = (c, f)=>(c||[]).forEach(f)
export const map = (c=[], f)=>c.map(f)
export const filter = (c=[], f)=>c.filter(f)
