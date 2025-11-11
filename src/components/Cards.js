import React,  { Fragment, createRef, useRef, useState, useEffect, useCallback, useMemo, memo } from 'react';
import { useScene } from '@ips/react/components/utils/use-scene';
import cx from '@ips/app/classnamex'
import { Column, Row } from '@ips/react/components/layout';
import { Slice } from '@/components/Slice';
import Overlay from '@ips/react/components/overlay'
import Sticky from '@ips/react/components/sticky'
import AText from './AText'
// import { colors } from '@/vars'
import Media from '@/components/Media'
// import MediaBack from '@/components/MediaBack'
import BackPlate from './BackPlate';
import { colors } from '@/vars'
import { times } from '@ips/app/hidash'

const CardBtn = ({ image, onClick })=><div className='cardBtn' onClick={onClick}>
    <Overlay mode="img" src={image}lx="0.5"ly="0.5"/>
</div>

const Card = ({ image, title, desc, state=0 })=><Column className={cx("card", "state"+state)}>
    <Media className="cardImg" noGutter media={{ url: image }}/>
    <AText style="cardTitle" text={title}/>
    <AText style="cardDesc" text={desc}/>
</Column>

export const Cards = ({ title, desc, cards, backPlateImage, buttonYes, buttonNo }) => {
    const scene = useScene()
    const [curCard, setCurCard] = useState(0)

    const isOver = curCard >= cards.length

    const range = [Math.max(0, curCard-2), Math.min(cards.length-1, curCard+2)]
    trace('range', range)

    const handleAnswer = (card, res)=>{

        if(card < cards.length - 1)
            setCurCard(s=>s+1)
    }

    const r = <Column w100>
        <Row w100 className="cardsTopCon">
            <Column width="40%" maxWidth="330px">
                <AText noGutter={false} style="cardsTitle" text={title}/>
                <AText noGutter={false} style="cardsDesc" text={desc}/>
            </Column>
            <Column width="30%">
                <AText noGutter={false} style="cardsTitle" text={"-"}/>
            </Column>
            <Column width="30%">
                <AText noGutter={false} style="cardsTitle" text={"-"}/>
            </Column>
        </Row>
        <Row w100 className="cardsMidCon">
            <CardBtn 
                image={buttonNo} 
                onClick={isOver?null:()=>handleAnswer(curCard, false)}
            />
            <Column width="30%">
                { times(range[1]-range[0]+1, 
                    i=>(
                        <Card 
                            key={curCard + i - 2} 
                            {...cards[range[0] + i]}
                            state={range[0] + i - curCard}
                        />)) }
            </Column>
            <CardBtn 
                image={buttonYes} 
                onClick={isOver?null:()=>handleAnswer(curCard, true)}
            />
        </Row>
    </Column>    
    
    return (
        <Slice 
            className={cx('cardsPage')}
            // column
            // align='center'
            // valign="bottom"
            // minHeight={`${scene.height}px`}
            // minHeight={scene.mobile?"100vh":`720px`}			
        >
            <div className="backPlatedCon">
                <BackPlate 
                    media={backPlateImage?{ url: backPlateImage }:null}
                    color={colors.lightBlue}
                /> 
                {r}
            </div>
        </Slice>
    )
}

export default Cards
