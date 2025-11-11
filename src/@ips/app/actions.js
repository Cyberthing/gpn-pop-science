import app from './app.js'
//trace('actions app', app)

app.actions = app.actions || {}

export function registerAction(name, action){
    app.actions[name] = action
}

export function execute(action){
        const a0 = action.split('(')
        const a1= a0[1].split(')')
        const aname = a0[0]
        const param = eval(a1[0])
        trace('executing', aname, param)
        if(app.actions[aname])
            app.actions[aname](param)
    }
