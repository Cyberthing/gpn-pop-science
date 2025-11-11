const fs = require('fs');
const path = require('path');
const jsdom = require('jsdom')
const { JSDOM } = jsdom

const processHTML = f=>new JSDOM(f)
const ExtProc = {
  'html':processHTML,
}

const processExt = ([ext, t])=>ExtProc[ext] ? ExtProc[ext](t) : t


const filePaths = [
  '../../critical/critical.html',
].map(f => path.resolve(__dirname, f));

const outFilePaths = [
  '../critical/index.js',
  '../critical/style.css',
].map(f => path.resolve(__dirname, f));

console.log(filePaths)
console.log(outFilePaths)

const files = filePaths.map(
  f =>[ f.split('/').pop().split('.').pop(), // get file extension
        fs.readFileSync(f, 'utf8') ] // get file
)


try {
  fs.mkdirSync(outFilePaths[4]);
} catch (err) {}

console.log(files.map(f => 'file ' + f[0] + ': ' + f[1].substr(0, 200)));

const objs = files.map(processExt);

const [ critical ] = objs
const doc = critical.window.document

// remove all scripts
Array.from(doc.body.querySelectorAll('script')).forEach((s)=>{
    s.parentElement.removeChild(s)
})

const bodyFrag = doc.body.children[0].outerHTML.replace(new RegExp('http://localhost:45678', 'g'), '${pp}')
const styleFrag = Array.from(doc.head.querySelectorAll('style')).map(s=>s.innerHTML).join('\n\n')

const all = `
//import './style.css'
export const html = pp=>\`${ bodyFrag  }\`
export const css = \`${ styleFrag  }\`
`

fs.writeFileSync(outFilePaths[0], all)//import \'./style.css\'\n\nexport const html = pp=>`' + bodyFrag + '`')
fs.writeFileSync(outFilePaths[1], styleFrag)

