import React, { Fragment, createRef, useRef, useEffect, useCallback, useMemo, useState, memo } from "react"
//import { AnimatePresence, motion } from "framer-motion"
import { Column, Row } from '@ips/react/components/layout';
import { Overlay } from '@ips/react/components/overlay';
import { Sticky } from '@/components/Sticky';
import Portal from '@/components/Portal';
import Fixed from '@ips/react/components/fixed';
import { useScene } from '@ips/react/components/utils/use-scene'
import { useRegistryEvent } from '@ips/react/components/utils/react-app-registry'
import Slice from '@/components/Slice';
import AText from '@/components/AText'
import MediaBack from '@/components/MediaBack';
import Media from '@/components/Media';
import ModalOverlay from '@/components/ModalOverlay'
import { times } from '@ips/app/hidash'
import cx from '@ips/app/classnamex'
import BurgerIconSvg from '@/svg/burgerIcon.svg'
import BandMarkSvg from '@/svg/bandMark.svg'
import { useConfig } from '@/hooks/useConfig'

const Tooltipped = ({ children, content })=>{
    const scene = useScene()
    if(scene.mobile)
        return children

    return <Column className="tooltipped">
        { children }
        <Overlay className="tooltipContent">
            <AText style="tooltip" text={ content }/>
        </Overlay>
    </Column>
}

const Burger = ({ isOpen, isCover, onClick, topLogo })=>(
    <Sticky className={cx("smBurger", isCover&&'isCover', isOpen&&'isOpen')}>
        <Row align="space-between">
            <Column w100 onClick={onClick}>
                <BurgerIconSvg className="burgerIcon"/>
            </Column>
            <Column className="topLogo">
                <Media media={topLogo}/>
            </Column>
        </Row>
    </Sticky>
)

export const NavBar = memo((p) => {

    const { title, topLogoMobile, isCover, bandTile, bandMark, bandPointer, indexIcons, articleData, articleTitles, navigateTo  } = p
    const scene = useScene()
    const config = useConfig()

    //trace('NavBar navigateTo', navigateTo)

    const [isOpen, setIsOpen] = useState()
    const toggleOpen = useCallback(()=>setIsOpen(s=>!s),[])
    const [curNav, setCurNav] = useState(-1)
    useRegistryEvent('nav', 'point', point=>setCurNav(point.index))

    useEffect(()=>{
        setTimeout(()=>setCurNav(-1), 10)
    },[])

    const navData = useMemo(()=>(
        articleData.map((hcount, i)=>(times(hcount+1, (j)=>(
            {
                article: i,
                header: j,
                tooltip: !j ? articleTitles[i]?.title : null,
            }
        )))).flat()
    ),[articleData])

    //trace('navData', navData)

    //const curArticle = useMemo(()=>{
    //    let a = 0
    //    let c = 0
    //    let emergency = articleData.length
    //    for(; c <= curNav && a < emergency; c+=articleData[a++]+1);
    //    return a - 1
    //},[articleData, curNav])

    const [refs, _setRefs] = useState(()=>{
        const count = articleData.reduce((a, i)=>a+i+1, 0)
        return Array.from({length: count}, createRef)
    })

    useEffect(()=>{
        console.assert(articleTitles?.length == articleData?.length, 'articleTitles.length should be equeal to articleData.length')
        setCurNav(0)
    },[])


    //trace('refs', refs)
    //trace('curNav', curNav)

    //console.log('articleData', articleData, p)

    let refCounter = 0

    const rBar =  <Column 
            height={`${scene.height}px`} 
            className="smNavBar"
            style={{
                "--iconCount": articleData.length,
                "--markCount": articleData.reduce((a, c)=>a+c, 0),
            }}
        >
            <MediaBack 
                className="bandTile"
                media={bandTile}
                lx="0.5"
            />
            <Overlay 
                lx="0.5"
                className="navBarMarks"
            >
                {articleData.map((a, i)=>(<Fragment  key={i}>
                    <Tooltipped
                        content={articleTitles[i]?.title}
                    >
                        <Media 
                            ref={refs[refCounter++]} 
                            className={cx("articleMark", 
                                navData[curNav]?.article==i && 'current', 
                                navData[curNav]?.article > i && 'prev')} 
                            media={indexIcons[i]}
                            onClick={()=>navigateTo(i)}
                        />
                    </Tooltipped>
                    { times(a, j=>(
                        <div
                            ref={refs[refCounter++]} 
                            key={j+100} 
                            className={cx("bandMark", 
                                navData[curNav]?.article==i && navData[curNav]?.header==j+1 && 'current', 
                                (navData[curNav]?.article > i || 
                                (navData[curNav]?.article == i && navData[curNav]?.header > j+1))
                                    && 'prev')}>
                            <BandMarkSvg/>
                        </div>

                            
                    ))}
                </Fragment>))}

            </Overlay>

        </Column>

                        {/* <Media 
                            ref={refs[refCounter++]} 
                            key={j+100} 
                            media={bandMark} 
                            className={cx("bandMark", navData[curNav]?.article==i && navData[curNav]?.header==j+1 && 'current', navData[curNav]?.header > j+1 && 'prev')}/> */}

    const rBarMobile =  <Column 
            // height={`${scene.height}px`} 
            className="smNavBar"
            style={{
                "--iconCount": articleData.length,
                "--markCount": articleData.reduce((a, c)=>a+c, 0),
            }}
        >
            <Column 
                className="navBarMarks"
            >
                <MediaBack 
                    className="bandTile"
                    media={bandTile}
                />
                {articleData.map((a, i)=>(<Fragment  key={i}>
                    <Row className="navBarRow"
                        onClick={()=>{
                            setIsOpen(false)
                            navigateTo(i)
                        }}
                    >
                        <Column 
                            className="navBarMark"
                            align="center"
                        >
                            <Media 
                                ref={refs[refCounter++]} 
                                className={cx("articleMark", navData[curNav]?.article==i && 'current')} 
                                media={indexIcons[i]}
                            />
                        </Column>
                        <AText style="navArticle" text={articleTitles[i]?.title}/>
                    </Row>
                    { times(a, j=>(<Row className="navBarRow"
                            onClick={()=>{
                                setIsOpen(false)
                                navigateTo(i, j+1)
                            }}
                        >
                        <Column 
                            className="navBarMark"
                            align="center"
                        >
                            <Media 
                                ref={refs[refCounter++]} 
                                key={j+100} 
                                media={bandMark} 
                                className={cx("bandMark", navData[curNav]?.article==i && navData[curNav]?.header==j+1 && 'current')}/>
                        </Column>
                        <AText style="navHeader" text={articleTitles[i]?.headers[j]}/>
                    </Row>))}
                </Fragment>))}

            </Column>
            <Fixed className="navBarTitle">
                <AText style="navTitle" text={title}/>
            </Fixed>

        </Column>

    if(scene.mobile)
        return <>
            <Burger 
                isOpen={isOpen} 
                onClick={toggleOpen} 
                topLogo={topLogoMobile}
                isCover={!isOpen && curNav < 0}
            />
            <ModalOverlay isOpen={isOpen}>
                { rBarMobile }
            </ModalOverlay>
        </>

    return (<Sticky className={cx("navBarCont", curNav < 0 && 'isCover')}>
        <Slice>
           { rBar }
        </Slice>
    </Sticky>)
})
export default NavBar