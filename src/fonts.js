import { createStyle } from '@ips/app/css-utils'

export default (cwd)=>{
 	const fontStyle = createStyle('fnt')
 	fontStyle.addRaw(`
 @font-face {
 	font-family: 'South';
 	src: url('${cwd}/fonts/South.woff2') format('woff2'),
 		 url('${cwd}/fonts/South.woff') format('woff');
 	font-weight: normal;
 	font-style: normal;
 }
`)
}
