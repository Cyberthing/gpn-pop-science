export default ({ loader, prerender, render })=>{
    return async (container, opts)=>{
        const prerenderInstance = prerender?prerender(container, opts):null
        const Loaded = await loader(container, opts)
        if(prerenderInstance&&prerenderInstance.loaded)
            prerenderInstance.loaded()
        render(Loaded, container, opts)
    }
}
