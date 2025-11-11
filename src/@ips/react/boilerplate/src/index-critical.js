import 'polyfills'
import '@ips/app/trace'
import '@ips/app/normalize.css'
import '@ips/app/modernizr'
import '@ips/app/sizer'
import './global.css'
import './fonts.styl'

// import React from 'react'
// import ReactDOM, { render } from 'react-dom'
// import { render } from 'react-snapshot'

import { loadScriptCb } from '@ips/app/utils'

import app from '@ips/app/app'
import appInject from '@ips/app/app-inject'

import render from './main-critical'

const locale = __BUILD_LOCALE__||'ru'

const prj = require('../project.json')[locale]
app.projectName = prj.name
app.title = prj.title
app.appMode = 'longread'

const inopts = {
    project: prj.name,
    scriptName: 'index.js',
    title: prj.title,
    desc: prj.description,
    url: prj.url,
    YMID: prj.YMID,
}

const doInject = ()=>{
    appInject((container, opts)=>{
        opts.mode = 'longread'

        app.publicPath = opts.publicPath

        render(container, opts)
    }, inopts)
}

// Support lame browsers
if(
    // Modernizr['browser-ie']||
    Modernizr['browser-safari'])
    loadScriptCb('https://dc.ria.ru/ips/lame.js', ()=>{
        loadScriptCb('https://dc.ria.ru/ips/lib/web-animations.min.js', doInject)
    })
else
    doInject()
