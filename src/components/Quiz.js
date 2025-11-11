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
import Lead from '@/components/Lead'

import { colors } from '@/vars'

const AnswerOption = ({text})=><div className='quizAnswerCont'>
    <AText noGutter={false} style="quizAnswer" text={text}/>
</div>

export const Quiz = ({ title, question, correct, answers, ava, button }) => {
    const scene = useScene()

    const r = (
        <Lead 
            className={cx('quizPage')}	
            backPlateColor={colors.lightBlue}
            left={()=><>
                <AText noGutter={false} style="quizTitle" text={title}/>
                <AText noGutter={false} style="quizQuestion" text={question}/>
                <div className='quizBtns'>
                    { answers.map((a, i)=><AnswerOption key={i} text={a}/>)}
                    <div className='quizAnsertBtnCont'>
                        <AText style="quizAnswerBtn" text={button}/>
                    </div>
                </div>
            </>}
            right={()=><>
                <Media className="quizAva" media={{
                    url: ava
                }}/>
            </>}
        />
    )
    return r
}

export default Quiz
