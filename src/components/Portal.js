import { useState, useEffect } from "react";
import ReactDOM from "react-dom";

export function Portal({ children, container, className='' }) {
  const [myContainer, setMyContainer] = useState()

  useEffect(() => {
    const cont = document.createElement('div')
    cont.className = 'portalWrapper ' + className
    document.body.appendChild(cont)
    //@ts-ignore
    setMyContainer(cont)

    return () => cont.remove()
  }, [])

  if (!container && !myContainer)
    return
  return ReactDOM.createPortal(children, container || myContainer)
}

export default Portal