const DOMParser = require('../../xmldom-mod').DOMParser
const XMLSerializer = require('../../xmldom-mod').XMLSerializer

const _ = require('lodash')
// console.log('parser', parser)

// Check if a string is CamelCase
function iscc(str) {
  return /[A-Z]/.test(str)
}

// Convert a name from kebab-case to CamelCase
function kc2cc(c, upper = true){
    if(iscc(c)) 
        return c

    if(upper)
        c = '-' + c
    return c.replace(/-([a-z])/g, function (g) { return g[1].toUpperCase(); })
}

const normalizeName = n=> n.replace(/\s+/g, '-').toLowerCase()


const propRole2Type = {
  'body':'text',
  'head':'text',
  'title':'text',
  'subtitle':'text',
  'desc':'text',
  'icon':'image',
  'illustration':'image',
  'sprite':'image',
  'avatar':'image',
}

const stdTags = ['html', 'head', 'body', 'title', 'meta', 'style', 'script', 'div', 'span', 'mark', 'img',  'a', 'p', 'i', 'strong', 'b', 'ul', 'li', 'h1', 'h2', 'h3', 'br', 'slot', 'figure', 'figcaption'] // 'video', 'audio', 'source',

function convertTemplate(template, opts){
    // var dom = parser.parseFragment(template)
    // var dom = parser.parse(template)
    // var dom = parser.parseXML(template)
    var dom = new DOMParser().parseFromString(template)
    // console.log('initial dom', dom)//JSON.stringify(dom, null, ' '))

    // opts = { ...opts, ...{ html:true, events:true, binds:true, cleanup:true } }
    opts = opts || { html:true, events:false, binds:true, cleanup:true }


    function convAttrs(node){
        if(!node.attributes && !node.attrs) return
        node.attributes = node.attributes||node.attrs
        // console.log('convAttrs', node.attributes)//.__proto__)

        for(var i = 0; i < node.attributes.length;){
            var a = node.attributes.item(i)
            // console.log(i, node.attributes.length, a.nodeName)

            if (opts.cleanup && a.nodeName == ':contenteditable'){
                // console.log('doka', i)
                node.attributes.removeNamedItem(a.nodeName)
                // node.attributes.splice(i, 1)
                // console.log('oka')
                continue;
            }

            if (a.nodeName == 'v-html'){

                a.nodeName = 'dangerouslySetInnerHTML'
                a.name = a.nodeName
                a.value = `{{ __html: ${ a.value } }}`
                a.nodeValue = a.value

                // console.log('----- got html ')


                // if(opts.html){
                //     node.appendChild(dom.createTextNode())
                //     // node.childNodes = node.childNodes||[]
                //     // node.childNodes.push({
                //     //     nodeName:'#text',
                //     //     value: `{{${ a.value }}}`,
                //     // })
                // }

                // node.attributes.removeNamedItem(a.nodeName)
                // node.attributes.splice(i, 1)
                // console.log('gt', i, node.attributes)
                // continue;
            }

            if (a.nodeName[0] == ':'){
                a.nodeName = a.nodeName.substr(1)
                a.name = a.nodeName

                a.value = `{ ${ a.value } }`
                a.nodeValue = a.value;

                // if(opts.binds){
                //     node.attributes.push({ name:a.nodeName.substr(1), value:`{{${ a.value }}}`})
                // }
                // node.attributes.removeNamedItem(a.nodeName)
                // node.attributes.splice(i, 1)
                // continue;
            }

            if(a.nodeName == 'addstyle'){
                a.nodeName = 'style'
                a.name = a.nodeName
            }

            if (a.nodeName == 'style'){
                a.nodeValue = `{{ ${ _.map(parseStyles(a.nodeValue), (s, i)=>`${ i }:'${ s }'`).join(', ') } }}`
                a.value = a.nodeValue
            }

            if (a.nodeName == 'class' 
                || a.nodeName == 'classname'){
                a.nodeName = 'className'
                a.name = a.nodeName
            }

            if (a.nodeValue == '{ fullClassname }'){
                a.nodeValue = '{ className }'
                a.value = a.nodeValue
            }
            
            if (a.nodeName == 'autoplay'){
                a.nodeName = 'autoPlay'
                a.name = a.nodeName
            }            

            if (a.nodeName[0] == '@'){
                a.nodeName = `on${ a.nodeName.substr(1) }`
                // if(opts.events){
                //     node.attributes.push({ name:`on:${ a.nodeName.substr(1) }`, value: a.value })
                // }
                node.attributes.removeNamedItem(a.nodeName)
                // node.attributes.splice(i, 1)
                continue;
            }

            i++
        }
    }

    function conv(node, parent){
        // _.each(node.childNodes, n => console.log('\nn', n))

        if(node.childNodes)
            for(var i = 0; i < node.childNodes.length; i++){
                var n = node.childNodes[i]

                if(n.tagName == 'slot'){

                    var nn = node.ownerDocument.createTextNode('{ children }')
                    node.insertBefore(nn, n)
                    node.removeChild(n)
                    i--
                    continue
                }

                conv(n, node)
            }

        const extStdTags = stdTags.concat(['slot'])

        // console.log('conv', node)
        if(node.tagName && node.tagName[0] != '#' && !_.includes(extStdTags, node.tagName))
            node.tagName = kc2cc(node.tagName)
        convAttrs(node)
    }

    conv(dom)
    // console.log('dom', dom)

    return new XMLSerializer().serializeToString(dom)

    // return parser.stringify(dom, 4);
    // return parser.serialize(dom)
}

function generateCode(name, props, slotted, mods, components, template){

    name = name.trim()
    _.each(props, p => p.name = p.name.trim())

/* ${ _.map(mods, m => m.name).join(', ') */
/* ${ _.map(mods, m => (`                if(${ m.name }) mods += ' ${ m.name }';`)).join('\n') } */

    let out = `import React, { Component } from 'react'
import "components/${ normalizeName(name) }.css"

import ModalImageList from "components/modal-image-list"
import { register, unregister } from "@ips/app/app-registry"

${ props.length ? `   
import { requestUrl } from '@ips/app/resource'
import carryUnions from '@ips/typo/carry-unions'
// import shyify from '@ips/typo/shyify'
` :'' }

${ _.map(components, c => `    import ${ kc2cc(c) } from "components/${ c }"`).join('\n') }
// computed:{
//     fullClassname:({ mod })=>{ var c = "${ name }"; if(mod) c += mod.split(' ').map(s => \` ${ name }_\$\{ s \}\`).join(' '); return c; },
// },

export default class ${ kc2cc(name) } extends Component{

    state = {}

    constructor(props){
        super(props)
        this.cprops = this.recalc(props, this.state, true)
    }

    componentWillUpdate(props, state){
        this.cprops = this.recalc(props, state)
    }

    recalc(props, state, force){
        let cprops = this.cprops||{}

        const { className, mod } = props

        cprops.className = '${ name } ' + (className||'') + ' ' + (mod||'').split(' ').map(s => \` ${ name }_\$\{ s \}\`).join(' ')
${ _.filter( props, p =>( propRole2Type[p.role]=='image' ))
    .map( p => `        cprops["${ p.name }"] = requestUrl(props["${ p.name }"], "image")`).join('\n') }
${ _.filter( props, p =>( propRole2Type[p.role]=='text' ))
    .map( p => `        cprops["${ p.name }"] = carryUnions(props["${ p.name }"] || '')`).join('\n') }
        return cprops
    }

    componentDidMount(){
        if(this.props.name)
            register(this.props.name, this)
    }

    componentWillUnmount(){
        if(this.props.name)
            unregister(this.props.name, this)
    }

    render(){
        const { ${ slotted ? 'children, ' : '' } } = this.props
        const { className, ${ _.map(props, p => p.name).join(', ') } } = this.cprops

        return (
${ convertTemplate(template).trim() })
    }

}

`
    return out;
}

// function generatePageCode(components){

//     let out = `
// ${ _.map(components, c => `    import ${ kc2cc(c) } from "components/${ c }"`).join('\n') }



//     export default {
//         components:{
// ${ _.map(components, c => `            ${ kc2cc(c) }`).join(',\n') }
//         }
//     }
// `
//     return out;
// }

function collectTags(html, excludeStdTags = true, excludeExtra = []) {
  

  // var doc = document.implementation.createHTMLDocument('');
  // doc.body.innerHTML = html;

  var doc = new DOMParser().parseFromString(html)

  var am = new Set();

  function tra(node) {
    // console.log('tra', node)
    if (node.tagName)
      am.add(node.tagName.toLowerCase())

    _.each(node.childNodes, n => tra(n))
  }

  tra(doc)

  if (excludeStdTags) {
    am.forEach(s => {
      if (_.includes(stdTags, s) || _.includes(excludeExtra, s))
        am.delete(s)
    })
  }

  return Array.from(am);
}

/**
 * @function parseStyles
 * Parses a string of inline styles into a javascript object with casing for react
 *
 * @param {string} styles
 * @returns {Object}
 */
const parseStyles = styles => styles
    .split(';')
    .filter(style => style.split(':')[0] && style.split(':')[1])
    .map(style => [
        style.split(':')[0].trim().replace(/-./g, c => c.substr(1).toUpperCase()),
        style.split(':')[1].trim()
    ])
    // .reduce((styleObj, style) => ({
    //     ...styleObj,
    //     [style[0]]: style[1],
    // }), {});
    .reduce((styleObj, style) => {
        styleObj[style[0]] = style[1]
        return styleObj
    }, {});


module.exports = {
    convertTemplate,
    generateCode,
    // generatePageCode,
    collectTags,
    parseStyles
}

