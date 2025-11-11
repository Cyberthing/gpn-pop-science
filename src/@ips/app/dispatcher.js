// WIP 
export class Dispatcher{
    contructor(uid){

    }

    async on(event, cb){
        const e = event.split('.')
        if(e.length != 2){
            error('dispatcher: wrong event format', event)
            return
        }
        const res = await request([e[0]])
        res[e[0]].on(e[1], cb)
    }

    off(event, cb){

    }
}
