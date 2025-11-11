import fs from 'fs/promises'
import path from 'path'

const tableFiles = ['d1','d2','d3','d4',]
const tabFiles = ['t1','t2','t3','t4',]

const srcPath = './tables'
const destPath = '../../src/data'

const tableColumns = [
	"Место",
	"Название компании",
	"Регион",
	"Отрасль",
	"Итоговый балл",
]

const tabColumns = [
	"Место",
	"Название компании",
	"Регион",
	"Численность",
	"Отрасль",
]

const collect = (data, keys)=>{
	const c = {}
	keys.forEach((k)=>c[k] = data[k])
	return c
}
const cleanupTable = (t, c, count)=>{
	if(count)
		t = t.slice(0, count)
	return t.map((d, i)=>collect(d, c))
}

const cleanupFile = async (f, c, count)=>{
	const fname = await path.resolve(`${srcPath}/${f}.json`)
	console.log('reading', fname)
	const tableJson = await fs.readFile(fname, { encoding: 'utf8' })
	const table = cleanupTable(JSON.parse(tableJson), c, 50)
	const tname = await path.resolve(`${destPath}/${f}.json`)
	console.log('writing', tname)
	await fs.writeFile(tname, JSON.stringify(table, null, ' '))
}

(async()=>{
	tableFiles.forEach((f)=>cleanupFile(f, tableColumns, 50))
	tabFiles.forEach((f)=>cleanupFile(f, tabColumns, 50))
})()
