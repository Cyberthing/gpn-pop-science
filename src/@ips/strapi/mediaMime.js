const  MT = {
	Image: 'image',
	Video: 'video',
	Data: 'data',
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
	'json': MT.Data,
}

const ExtToExt = {
	'jpg': 'jpeg',
	'jpeg': 'jpeg',
	'png': 'png',
	'apng': 'apng',
	'gif': 'gif',
	'svg': 'svg',
	'mp4': 'mp4',
	'webm': 'webm'
}

export const mediaMimeToType = m=>m?.split('/')[0]
export const mediaUrlToType = m=>MediaTypes[m.split('.').pop().toLowerCase()]
export const mediaUrlToMime = m=>{
	const ext = m.split('.').pop().toLowerCase()
	return MediaTypes[ext]+'/'+ExtToExt[ext]
}
export default mediaMimeToType
