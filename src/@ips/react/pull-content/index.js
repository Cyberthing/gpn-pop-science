const fs = require('fs');
const http = require('http');
const coco = require('../component-converter');
const _ = require('lodash')
// console.log('coco', coco)
const trace = function(){ console.log.apply(console, arguments) }

const server = process.argv[2] || '10.1.125.69:9090'
const projectId = process.argv[3] || '1'
trace('server', server)
trace('project', projectId)

const tabs = {
    layouts: 'http://localhost:3001/layouts',
    components: `http://${ server }/components.json`,
    project: `http://${ server }/projects/${ projectId }.json`,
}

const conentFolder = 'src/content'
const tempFolder = 'tmp'

function getsome(url, cacheFile){
    return new Promise((resolve, reject)=>{

            http.get(url, (res) => {
                res.setEncoding('utf8');
                let rawData = '';
                res.on('data', (chunk) => {
                   rawData += chunk;
                });

                res.on('end', () => {
                    fs.writeFileSync(cacheFile, rawData);

                    const parsedData = JSON.parse(rawData);
                    resolve(parsedData)
                })
            })
            .on('error', () => {
                console.log('error getting data from the server. reading cache file', cacheFile)
                try{ 
                    var rawData = fs.readFileSync(cacheFile);
                    const parsedData = JSON.parse(rawData);
                    resolve(parsedData)
                }catch(err){
                    console.error(err.code, err.path)
                    resolve()
                }
            })            

    })
}

function kc2cc(c, upper = true){
    if(upper)
        c = '-' + c
    return c.replace(/-([a-z])/g, function (g) { return g[1].toUpperCase(); })
}

const normalizeName = n=> n.replace(/\s+/g, '-').toLowerCase()

function saveProjectFiles(p){
    fs.writeFileSync(`${ tempFolder }/project.json`, JSON.stringify(p, null, '  '))

    const pages = _.map(p.records, r => _.find(r.field.fields, f => f.type == 'component_editor') ? normalizeName(r.name || r.id) : null).filter( p=>p );
    fs.writeFileSync(`${ conentFolder }/pages.js`, `\
${ pages.map( p => `import ${ kc2cc(p) } from "pages/${ p }"`).join('\n') }

export default {
${ pages.map( p => '    ' + kc2cc(p)).join(',\n') }    
}
`)

    // fs.writeFileSync(`${ conentFolder }/components.js`, JSON.stringify(p, null, '  '))
    fs.writeFileSync(`${ conentFolder }/styles.css`, p.style)
    _.each(p.style_list, s =>{
        fs.writeFileSync(`${ conentFolder }/${ s.name }.${ s.ext == 'stylus' ? 'styl' : 'css' }`, s.body)
    })
}

const generatePage = page=>{
    const tpl = coco.convertTemplate(page.value)
    const compos = coco.collectTags(page.value)
    return`\
import React from 'react'

${ _.map(compos, t => `import ${ kc2cc(normalizeName(t)) } from "components/${ normalizeName(t) }"`).join('\n')}

    export default () => (
${ tpl }
)
`
}

const generateAsyncPage = r=>{
    return`\
import React from 'react'
import Loadable from 'react-loadable'

const M = Loadable({
                loader: ()=>import(/* webpackChunkName: "${normalizeName(r.name || r.id)}" */'./${normalizeName(r.name || r.id)}'),
                loading: ()=><div>page ${normalizeName(r.name || r.id)} is loading</div>
            })

export default M
`
}

getsome(tabs.project, `${ tempFolder }/project.json`).then((p)=>{
    saveProjectFiles(p)
    p.records.map((r)=>{
        const page = _.find(r.field.fields, f => f.type == 'component_editor');
        if(page){
            const fname = `${ conentFolder }/pages/${ normalizeName(r.name || r.id) }.js`
            console.log(fname)
            fs.writeFileSync(fname, generatePage(page))

            const asyncfname = `${ conentFolder }/pages/${ normalizeName(r.name || r.id) }-async.js`
            console.log(asyncfname)
            fs.writeFileSync(asyncfname, generateAsyncPage(r))
        }

        const json = _.find(r.field.fields, f => f.type == 'json_editor');
        if(json){
            const fname = `${ conentFolder }/json/${ normalizeName(r.name || r.id) }.json`
            fs.writeFileSync(fname, json.value);
        }
    })
})


const buildCompo = c => `
${ coco.generateCode(c.name, c.props, c.slotted, c.mods, c.components, c.template) }
`

const buildCss = c => `
${ c.cssStyle || c.style }

${ _.map(c.mods, m=>m.scopedStyle ).join('\n') }
`

getsome(tabs.components, `${ tempFolder }/components.json`).then((res)=>{

    res.map((c)=>{
        const cc = c.content
        const fname = `${ conentFolder }/components/${ normalizeName(cc.name || cc.id) }.js`
        console.log(fname)
        fs.writeFileSync(fname, buildCompo(cc))

        const stylefname = `${ conentFolder }/components/${ normalizeName(cc.name || cc.id) }.css`
        console.log(stylefname)
        fs.writeFileSync(stylefname, buildCss(cc))
     })

    const compos = res.map( c => normalizeName(c.content.name || c.content.id) );

    fs.writeFileSync(`${ conentFolder }/components.js`, `\
${ compos.map( p => `import ${ kc2cc(p) } from "components/${ p }"`).join('\n') }

export default {
${ compos.map( p => '    ' + kc2cc(p)).join(',\n') }    
}
`)

})
