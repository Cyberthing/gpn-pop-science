import { nop, objEqualShallow } from '@ips/app/hidash.js'
import { windowSize, getScrollbarWidth } from '@ips/app/dom-utils.js'
import app from '@ips/app/app.js'
// import vhCheck from 'vh-check'
const scrollbarWidth = getScrollbarWidth()

const mutaConfig = 	{ 
	attributes: true,
	attributeFilter: ['class']
}

// Check these out
// https://stackoverflow.com/questions/50990006/get-android-chrome-browser-address-bar-height-in-js
// https://developers.google.com/web/updates/2016/12/url-bar-resizing
// https://github.com/duckduckgo/Android/issues/1012

const fix = document.createElement('div')
// fix.style.display = 'none'
fix.style.visibility = 'hidden'
fix.style.pointerEvents = 'none'
fix.style.position = 'fixed'
fix.style.left = '0'
fix.style.top = '0'
fix.style.right = '0'
fix.style.bottom = '0'
fix.style.overflowY = 'scroll'
document.body.appendChild(fix)

// const fixScroll = document.createElement('div')
// // fix.style.display = 'none'
// fixScroll.style.visibility = 'hidden'
// fixScroll.style.pointerEvents = 'none'
// fixScroll.style.position = 'fixed'
// fixScroll.style.left = '0'
// fixScroll.style.top = '0'
// fixScroll.style.right = '0'
// fixScroll.style.bottom = '0'
// fixScroll.style.overflowY = 'scroll'
// document.body.appendChild(fixScroll)
const defCon = { box : 'border-box' }

export const StandaloneSceneLogic = (opts={}, onUpdate)=>{

	opts = opts||{}

	// const { mobileWidth=425, tabletWidth=768 } = opts
	const { mobile={ width:425 }, tablet={ width:768 }, desktop, keepMobileHead=true } = opts

	const onResizeFix = ()=>{

	}

	const calcScene = ()=>{
	  	const ws = windowSize()
	  	// const check = vhCheck()
	  	// trace('check', check)

		const isMobile = ws.x <= mobile.width
		const isTablet = tablet.width > 0 ? (ws.x <= tablet.width && ws.x > mobile.width) : false
		const isDesktop = ws.x > (tablet.width > 0 ? tablet.width : mobile.width)
		let w = ws.x
		let h = ws.y//check.vh

		// if(keepMobileHead && isMobile)
		// 	h -= 40

		// if(Modernizr['platform-ios']&&Modernizr['browser-safari'])
		// 	h -= 30

		if(Modernizr['platform-mobile']&&Modernizr['browser-duckduckgo'])
			h -= 56

		const width = (fix.offsetWidth-1)|0
		const widthScrolled = fix.clientWidth|0
		const scrollWidth = Math.max(0, widthScrolled - width)

		return({ 
			config: opts,
			// width: w,
			// height: h, 
			width,
			widthScrolled,
			scrollWidth,
			height: (fix.offsetHeight-1)|0, 
			vertical: h>w, 
			aspect: w/h, 
			mobile: isMobile,
			tablet: isTablet,
			desktop: isDesktop,
		})
  	}

	const destructors = []
	const updateScene = ()=>{
		onUpdate(calcScene())
	}
	window.addEventListener('resize', updateScene)
	destructors.push(()=>window.removeEventListener('resize', updateScene))

    const resizeObserver = new ResizeObserver(updateScene);
    resizeObserver.observe(fix, defCon);
	destructors.push(()=>resizeObserver.disconnect())

	updateScene()

  	return ()=>destructors.forEach(d=>d())
}

export const RiaSceneLogic = (opts, onUpdate)=>{

	opts = opts||{}

	const { mobile={width:425}, tablet={width:768}, desktop } = opts

	let ria = {}

	const calcScene = ()=>{
		{/* const vw = (fix.offsetWidth-1)|0 */}
		{/* const vh = (fix.offsetHeight-1)|0 */}
		const vw = (fix.offsetWidth)|0
		const vh = (fix.offsetHeight)|0

		const widthInScroll = fix.clientWidth|0
		const scrollWidth = Math.max(0, vw - widthInScroll)

		const isMobile = vw <= mobile.width
		const isTablet = tablet.width > 0 ? (vw <= tablet.width && vw > mobile.width) : false
		const isDesktop = vw > (tablet.width > 0 ? tablet.width : mobile.width)

		let w = Math.min(1440, vw)
		let h = vh

		const inlineRia = Modernizr['inline-ria']
		const headerCompact = w <= 1235
		const headerHeight = 56//(!inlineRia)?0:headerCompact?40:60

		if(inlineRia)
			h-=headerHeight

		let lentaHeight = 0
		if(ria.lentaActive){ 
			// because of the site's logic inconsistency we cannot rely on the html/body class flags 
			// and have to check the size of the screen here
			lentaHeight = w > 1235 ? 64 : w > 925 ? 50 : w > 768 ? 64 : 78
			h-= lentaHeight
			if(Modernizr['platform-ios']&&Modernizr['browser-safari'])
				h -= 30
			else
			if(Modernizr['platform-mobile']&&Modernizr['browser-duckduckgo'])
				h -= 56

		}

		return({ 
			config: opts,
			width: w, 
			height: h,
			vw,
			vh, 
			vertical: h>w, 
			aspect: w/h, 
			mobile: isMobile,
			tablet: isTablet,
			desktop: isDesktop,
			inlineRia,
			headerCompact,
			headerHeight,
			lentaHeight,
			...ria,
			// set:true
		})
  	}

	const calcRia = ()=>{
		const cl = document.body.classList
		return ({
			lentaActive: cl.contains('m-widget-lenta-active'),
			riaHeaderSticked: cl.contains('m-header-sticked'),
			riaWidthMax: cl.contains('m-width-max'),
		})
	}

	const destructors = []
	const updateScene = ()=>{
		onUpdate(calcScene())
	}
	window.addEventListener('resize', updateScene)
	destructors.push(()=>window.removeEventListener('resize', updateScene))

	const mutabor = new MutationObserver(somn=>{
		if(somn.filter(mr=>mr.type == 'attributes' && mr.attributeName == 'class').length){
			ria = calcRia()
			updateScene()
		}
	})

	mutabor.observe(document.body, mutaConfig)
	destructors.push(()=>mutabor.disconnect())

	ria = calcRia()
	updateScene()

	return ()=>destructors.forEach(d=>d())
}

export const SputnikSceneLogic = (opts, onUpdate)=>{

	opts = opts||{}

	const { mobile={width:425}, tablet={width:768}, desktop } = opts

	const calcSputnik = ()=>({
		lentaActive: document.body.classList.contains('m-widget-lenta-active'),
		headerSticked: document.body.classList.contains('m-header-sticked'),
		headerAlert: !!(document.getElementById('header')?.querySelector('.alert')),
	})

	let sputnik = calcSputnik()

	const calcScene = ()=>{
		const ws = windowSize()

		const inlineSputnik = Modernizr['inline-sputnik']
		const headerCompact = ws.x <= 840
		const headerHeight = (!inlineSputnik)?0:headerCompact?54:60
		const isMobile = ws.x <= mobile.width
		const isTablet = tablet.width > 0 ? (ws.x <= tablet.width && ws.x > mobile.width) : false
		const isDesktop = ws.x > (tablet.width > 0 ? tablet.width : mobile.width)

		let w = Math.min(1440, ws.x - scrollbarWidth)
		let h = ws.y
		if(inlineSputnik){
			h-= headerHeight

			if(sputnik.lentaActive){ 
				// because of the site's logic inconsistency we cannot rely on the html/body class flags 
				// and have to check the size of the screen here
				h-= w < 1235 ? 50 : 80
				if(Modernizr['platform-ios']&&Modernizr['browser-safari'])
					h -= 30
				else
				if(Modernizr['platform-mobile']&&Modernizr['browser-duckduckgo'])
					h -= 56
			}
		}

		return({ 
			config: opts,
			width: w, 
			height: h, 
			vertical: h>w, 
			aspect: w/h, 
			mobile: isMobile,
			tablet: isTablet,
			desktop: isDesktop,
			inlineSputnik,
			headerCompact,
			headerHeight,
			...sputnik,
		})
  	}

	const destructors = []
	const updateScene = ()=>{
		onUpdate(calcScene())
	}
	window.addEventListener('resize', updateScene)
	destructors.push(()=>window.removeEventListener('resize', updateScene))

	const mutabor = new MutationObserver(somn=>{
		if(somn.filter(mr=>mr.type == 'attributes' && mr.attributeName == 'class').length){
			sputnik = calcSputnik()
			updateScene()
		}
	})

	mutabor.observe(document.body, mutaConfig)
	destructors.push(()=>mutabor.disconnect())

	updateScene()

	return ()=>destructors.forEach(d=>d())
}

const setListedClass = ($el, list, cl)=>{
    for(var i = 0; i < list.length; i++){
        $el.classList.remove(list[i])
    }
    if(cl)
        $el.classList.add(cl)
}

export const createSceneLogic = (sceneLogic, inopts, onUpdate)=>{
	let scene = null

	const opts = (()=>{
		const o = {}
		o.desktop = inopts.desktop||{}
		o.tablet = inopts.tablet||{}
		o.mobile = inopts.mobile||{}
		if(inopts.tabletWidth && inopts.tabletWidth > 0)
			o.tablet.width = inopts.tabletWidth
		if(inopts.mobileWidth && inopts.mobileWidth > 0)
			o.mobile.width = inopts.mobileWidth

		o.desktop.className = o.desktop.className||'scene-desktop'
		o.tablet.className = o.tablet.className||'scene-tablet'
		o.mobile.className = o.mobile.className||'scene-mobile'

		return o
	})()

	const handleUpdate = newScene=>{
		if(!objEqualShallow(newScene, scene)){
			scene = newScene
			onUpdate(scene)

			app.scene = scene

			document.documentElement.classList.toggle(opts.desktop.className, scene.desktop)
			document.documentElement.classList.toggle(opts.tablet.className, scene.tablet)
			document.documentElement.classList.toggle(opts.mobile.className, scene.mobile)
			document.documentElement.classList.toggle('scene-vertical', scene.vertical)
			document.documentElement.classList.toggle('scene-lentaActive', scene.lentaActive)
		}
	}

	const destroy = sceneLogic(opts, handleUpdate)||nop

	return {
		context: ()=>scene,
		destroy,
	}
}
