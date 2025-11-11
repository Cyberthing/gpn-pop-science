import { AnimatePresence, motion } from "framer-motion"
import React, { Fragment, useEffect, useState } from "react"
//import HeroCardMobile from "./HeroCardMobile"

const variants = {
    initial: {
        opacity: 0,
    },
    animate: {
        opacity: 1,
    },
    exit: {
        opacity: 0.999,
    },
}

let count = 0
export const HeroMobile = ({ images }) => {
    console.log('HeroMobile', images)
    const [current, setCurrent] = useState(0)

    let timerID = 0

    useEffect(() => {
        {/* count++ */}
        {/* if(count > 2) */}
        {/*     return */}
        // if (timerID === null){
            clearTimeout(timerID)
            timerID = setTimeout(() => setCurrent((current + 1) % images.length), 5000)
        // }
        return () => clearTimeout(timerID)
    }, [current])

    return (
        <>
            <div className='relative w-full aspect-34 bg-red-500-0'>
                <AnimatePresence initial={false}>
                    <motion.img
                        variants={variants}
                        initial='initial'
                        animate='animate'
                        exit='exit'
                        transition={{
                            type: "tween",
                            duration: 3.7,
                        }}
                        src={images[current].src}
                        key={images[current].src}
                        alt=''
                        className='rounded-lg w-full aspect-34 left-0 object-cover absolute'
                    />
                </AnimatePresence>
            </div>

            {/* <div className='w-full flex items-center justify-center space-x-4 py-4'> */}
            {/*     {images.map((_, i) => ( */}
            {/*         <div */}
            {/*             key={i} */}
            {/*             className={`w-5 h-1 rounded-full transition-colors duration-300 ${ */}
            {/*                 i === current ? "bg-red-500" : "bg-white" */}
            {/*             }`} */}
            {/*             onClick={() => setCurrent(i)} */}
            {/*         ></div> */}
            {/*     ))} */}
            {/* </div> */}
        </>
    )
}
//export default HeroMobile