<svelte:window on:scroll='onScroll()'/>

<div ref:node class="{ fullClassName }" style="{ pageStyle||'' }">
    <div ref:fix class="cont { fixMode }" style="{ fixStyle }">
        <slot/>
    </div>
</div>

<style lang="stylus">

</style>

<script>

    import './page.styl'

    import { getFullOffsetTop, getFullOffsetLeft, windowSize, windowScrollY } from '@ips/app/dom-utils'
    import { register } from '@ips/app/app-registry'

    export default {
        props:["name", "classname", "addstyle"],
        data(){
            return {
                fixStyle:'',
                pageStyle:''
            }
        },
        computed:{
            fullClassName: ({ classname })=> 'page ' + (classname||'')
        },
        oncreate(){
            if(this.get().name)
                register(this.get().name, this)
        },
        methods:{
            onScroll(){
                const y = windowScrollY()
                const ws = windowSize()

                const node = this.refs.node
                const ofs = y - getFullOffsetTop(node)
                const dsize = node.offsetHeight - ws.y

                if( ofs > node.offsetHeight ){
                    this.set({ 
                        fixMode: 'off'
                    })
                }else if( ofs > dsize ){
                    this.set({ 
                        fixMode: 'fix',
                        fixStyle: `transform:translate(${ getFullOffsetLeft(this.refs.fix) }px, ${ -dsize }px); opacity:${ 1-(ofs - dsize)/ws.y }`,
                        pageStyle:`height:${ node.offsetHeight }px`
                    })
                }
                else {
                    this.set({ fixMode: false, fixStyle: '', pageStyle:'' })
                }
            }
        }
    }

</script>