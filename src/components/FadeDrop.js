import { AnimatePresence, motion } from "framer-motion"
import React, { Fragment, useEffect, useState, memo } from "react"

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

const xfadeVariants = {
    initial: {
        opacity: 0,
    },
    animate: {
        opacity: 1,
    },
    exit: {
        opacity: 0,
    },
}



export const FadeDrop = memo(({ slide, id, xfade }) => {
    //console.log('FadeDrop', slide)
    //const [current, setCurrent] = useState(0)

    //useEffect(() => {
    //    setCurrent(slide)
    //    //return () => clearTimeout(timerID)
    //}, [slide])

        //<div className='relative w-full aspect-34 bg-red-500-0'>
        //</div>
	
    return (
            <AnimatePresence initial={false}>
                <motion.div
                    variants={xfade? xfadeVariants : variants}
                    initial='initial'
                    animate='animate'
                    exit='exit'
                    transition={{
                        type: "tween",
                        duration: 0.7,
                    }}
                    children={slide}
                    key={id}
                    // className='rounded-lg w-full aspect-34 left-0 object-cover absolute'
                    className='size-cover absolute'
                />
            </AnimatePresence>
    )
})
export default FadeDrop