// import { isString } from '@ips/app/hidash'

// const isTru = v=>!!v

const processMain = (m, config)=>{
	return ({ ...m, 
		backs: m.articles.map(a=>({ media: { url: a.background } })),
	})
}

export default (data, config)=>{
	//trace('processing data', data)
	return {
		main: processMain(data.main, config)
	}
}
