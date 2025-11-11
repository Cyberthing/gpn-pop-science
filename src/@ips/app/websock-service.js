export const connect = url => new Promise((resolve, reject)=>{
  console.log('websock-service.connect', url)

  const ws = new WebSocket(url)

  const conn = {
    ws,
    resolve:()=>{},
    render: text => new Promise((resolve, reject)=>{
      console.log('websock-service.render', ws.readyState)
      conn.resolve = resolve
      ws.send(text)
    }),
    destroy: ()=> ws.close()
  }

  ws.addEventListener('message', e => conn.resolve(e))
  ws.addEventListener('open', ()=>{ console.log('websock-service.open', url); resolve(conn) })
})

