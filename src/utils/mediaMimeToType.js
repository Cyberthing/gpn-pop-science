const  MT = {
	Image: 'image',
	Video: 'video',
}
const MediaTypes = {
	'jpg': MT.Image,
	'jpeg': MT.Image,
	'png': MT.Image,
	'apng': MT.Image,
	'gif': MT.Image,
	'svg': MT.Image,
	'mp4': MT.Video,
	'webm': MT.Video,
}

export const mediaMimeToType = m=>(m||"").split('/')[0]
export const mediaUrlToType = m=>MediaTypes[(m||"").split('.').pop().toLowerCase()]
export default mediaMimeToType
