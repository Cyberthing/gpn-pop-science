import React from 'react'

export function useLockBodyScroll() {
  React.useLayoutEffect(() => {
    const { body, documentElement } = document
    // const originalStyle = window.getComputedStyle(document.body).overflow;
    // document.body.style.overflow = "hidden";
    const scrollTop = documentElement.scrollTop// = scrollTop
    body.classList.add('noscroll')
    // trace('scrollTop', scrollTop)
    body.style.top = `-${scrollTop}px`
    return () => {
      body.classList.remove('noscroll')
      body.style.removeProperty("top")

      documentElement.style.scrollBehavior = "auto";
      documentElement.scrollTop = scrollTop;
      documentElement.style.removeProperty("scroll-behavior");

      // document.body.style.overflow = originalStyle;
    };
  }, []);
}

export function useLockHtmlScroll() {
  React.useLayoutEffect(() => {
    const { body, documentElement } = document
    // const originalStyle = window.getComputedStyle(document.body).overflow;
    // document.body.style.overflow = "hidden";
    const scrollTop = documentElement.scrollTop// = scrollTop
    documentElement.classList.add('noscroll')
    // trace('scrollTop', scrollTop)
    documentElement.style.top = `-${scrollTop}px`
    return () => {
      documentElement.classList.remove('noscroll')
      documentElement.style.removeProperty("top")

      documentElement.style.scrollBehavior = "auto";
      documentElement.scrollTop = scrollTop;
      documentElement.style.removeProperty("scroll-behavior");

      // document.body.style.overflow = originalStyle;
    };
  }, []);
}


export default useLockBodyScroll