// import { isString } from '@ips/app/hidash'

const isTru = v=>!!v


const wrapTypeGroups = (blocks, type, groupType)=>{
	const out = []
    let i = 0;
    //trace('blocks.length', blocks.length)
    while(i < blocks.length){
		const chunks = []
		for(; i < blocks.length&&blocks[i].__typename != type; i++){
			out.push(blocks[i])
		}
		for(; i < blocks.length&&blocks[i].__typename == type; i++){
			chunks.push(blocks[i])
		}
		out.push({
			__typename: groupType,
			blocks: chunks
		})
	}
    return out
}

const tooltips = {
	'Ирина Карпачева': 'Начальник отдела «История Москвы» Музея Москвы',
	'Ксения Смирнова': 'Замдиректора Музея архитектуры имени А. В. Щусева по просветительской деятельности',
	'Филипп Смирнов': 'Историк Москвы',
	'Александр Васькин': 'Москвовед',
	'Владимир Ресин': 'Депутат Госдумы',
	'Александр Кудрявцев': 'Народный архитектор РФ',
	'Мария Калиш': 'Москвовед',
	//'Петр Кудрявцев': 'Правнук автора проекта МГУ Сергея Чернышёва',
	'Владимир Воронин': 'Председатель совета директоров группы компаний «ФСК»',
	'Владимир Ефимов': 'Заммэра Москвы по вопросам градостроительной политики и строительства',
	'Андрей Боков': 'Народный архитектор РФ',
	'Михаил Крестмейн': 'Главный инженер Института Генплана Москвы',
	'Сергей Кузнецов': 'Главный архитектор Москвы',
	'Николай Шумаков': 'Глава Союза архитекторов',
	'Надежда Колганова': 'Главный архитектор проектной компании Blank',
}

const tooltipTpl = (s, t)=>`<span class="tooltippedInline">${s}<span class="tooltip-content">${t}</span></span>`
const wrapTooltips = s=>{

	const ss = s
		.replace(/\./g, " ")
		.replace(/&nbsp;/g, " ")
		.toLowerCase().split(' ')
		trace('ss', ss)
	const candies = Object.entries(tooltips).filter(tt=>{
		const [look, tip] = tt
		const look2 = look.toLowerCase().split(' ')[1]

		const sstip = tip.toLowerCase().split(' ')
		//trace('sstip', sstip)
		trace('look2', look2)

		return (s.includes(look) || ss.includes(look2))
		  && sstip.some(tw=>{
		  	if(tw.length < 5)
		  		return false
		  	const res = !ss.includes(tw)
		  	if(res)
		  		trace('not found', tw, look, 'in', ss)
		  	return res
		})
	})

	if(candies.length)
		trace('candies', s, candies)

	candies.forEach(tt=>{
		const [look, tip] = tt

		const ss = s.split(look)
		if(ss.length == 1){
			const look2 = look.split(' ')[1]
			const sss = s.split(look2)
			if(sss.length == 1){
				return
			}
			s = sss.join(tooltipTpl(look2, tip))
		}else
			s = ss.join(tooltipTpl(look, tip))
	})
	return s
}

const processBlock = b=>{
	if(b.__typename == "ComponentArticleText" || b.__typename == "ComponentArticleQuote")
		return {...b, text: wrapTooltips(b.text)}

	if(b.__typename == 'VrezSection'){
		return {...b, blocks: b.blocks.map(processBlock) }
	}

	return b
}

const processMain = (m, config)=>{
	const articles = m.articles.map(a=>({...a, 
		blocks: wrapTypeGroups(
			a.blocks.filter(isTru),
			'ComponentArticleFacto', 'FactoGroup')
	}))
	return ({ ...m, 
		articles: articles.map(a=>({...a, blocks: a.blocks.map(processBlock) })),
		backs: articles.map(
			a=>[{
					media: a.background,
					style: 'nofade',
					creditImg: config?.logoWhite,
				}, 
				...a.blocks
					.filter(b=>b.__typename == "ComponentArticlePhotoSlide")])
			.flat(),
		factos: articles.map(
			a=>a.blocks.filter(b=>b.__typename == "FactoGroup"))
			.flat()
	})
}
	

export default (data, config)=>{
	//trace('processing data', data)
	return {
		main: processMain(data.main, config)
	}
}
