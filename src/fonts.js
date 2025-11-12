import { createStyle } from '@ips/app/css-utils'

export default (cwd)=>{
 	const fontStyle = createStyle('fnt')
 	fontStyle.addRaw(`
 @font-face {
 	font-family: 'PTRootUI';
 	src: url('${cwd}/fonts/PT-Root-UI_VF.ttf') format('ttf');
 	font-weight: normal;
 	font-style: normal;
 }
`)
}
