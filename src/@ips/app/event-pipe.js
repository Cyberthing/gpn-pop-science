import { request } from '@ips/app/app-registry.js'
import EventEmitter from '@ips/app/event-emitter.js'

export default class EventPipe extends EventEmitter{
    constructor(source, event, value){
        super()

        this.props = { source, event, value }
        this.created()
    }

    async created(){
        const { source, event, value } = this.props
        const res = await request([source])
        this.source = res[source]
        this.source.ee.on(event, e => this.fire('update', e[value]))
    }

    destroy(){
        if(this.source)
            this.source.ee.off(event)
    }

    static parse(s){
        if(s.startsWith('eventPipe')){
            const brax = /\(([^)]+)\)/
            s = s.match(brax)[1].split(',').map(s => s.trim())
            return new EventPipe(...s)
        }
    }    
}

