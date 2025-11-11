import React, { useLayoutEffect } from 'react'

export default (is, $el=document.documentElement) =>{
  useLayoutEffect(() => {
   if(!is)
        return
   // Get original overflow
   const originalStyle = window.getComputedStyle($el).overflow;  
   if(originalStyle == 'hidden')
      return   
   // Prevent scrolling on mount
   $el.style.overflow = 'hidden';
   // Re-enable scrolling when component unmounts
   return () => $el.style.overflow = originalStyle;
   }, [$el, is])
}

