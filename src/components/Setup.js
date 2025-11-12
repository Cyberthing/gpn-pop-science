import React from 'react';
import { TextStyle } from '@ips/react/components/text-style';
import { GridStyle } from '@ips/react/components/layout';
import { colors } from '@/vars'
import { useScene } from '@ips/react/components/utils/use-scene';

const Setup = () => {

  const scene = useScene()

  return (
    <>
      <GridStyle gutter='10' gutterMobile='16' 
        maxWidth={1180}
        // padding={"85"}
        padding={scene.mobile?"":"20"}
        columns="15"
        width="15"
      />

      <TextStyle
        name='coverUptitle'
        fontFamily='PTRootUI'
        fontFamilyDefault='sans-serif'
        fontSize='30'
        lineHeight='1.2'
        mobile={{ fontSize:'52px' }}
        fontWeight='400'
        letterSpacing='0.16em'
        fontStyle='normal'
        color="white"
        textTransform="uppercase"
        textAlign="center"
      />

      <TextStyle
        name='coverTitle'
        fontFamily='Geologica'
        fontFamilyDefault='sans-serif'
        fontSize='75'
        lineHeight='0.8'
        mobile={{ fontSize:'52px' }}
        fontWeight='700'
        letterSpacing='1.01px'
        fontStyle='normal'
        color={colors.green}
        // textAlign="center"
      />

      <TextStyle
        name='coverLead'
        fontFamily='PTRootUI'
        fontFamilyDefault='sans-serif'
        fontSize='18'
        lineHeight='1.38'
        mobile={{ fontSize:'52px' }}
        fontWeight='400'
        letterSpacing='1.01px'
        fontStyle='normal'
        color="white"
        textAlign="center"
      />

      <TextStyle
        name='leadTitle'
        fontFamily='Finlandica'
        fontFamilyDefault='sans-serif'
        fontSize='60'
        lineHeight='1.3'
        mobile={{ fontSize:'52px' }}
        fontWeight='400'
        letterSpacing='1.01px'
        fontStyle='normal'
        color="black"
        textTransform="uppercase"
        // textAlign="center"
      />

      <TextStyle
        name='leadHeader'
        fontFamily='Finlandica'
        fontFamilyDefault='sans-serif'
        fontSize='36'
        lineHeight='1.3'
        mobile={{ fontSize:'52px' }}
        fontWeight='400'
        letterSpacing='1.01px'
        fontStyle='normal'
        color="black"
        textTransform="uppercase"
        // textAlign="center"
      />

      <TextStyle
        name='leadText'
        fontFamily='Finlandica'
        fontFamilyDefault='sans-serif'
        fontSize='22'
        lineHeight='1.3'
        mobile={{ fontSize:'52px' }}
        fontWeight='400'
        letterSpacing='1.01px'
        fontStyle='normal'
        color="black"
        // textAlign="center"
      />
      <TextStyle
        name='quizTitle'
        fontFamily='Finlandica'
        fontFamilyDefault='sans-serif'
        fontSize='36'
        lineHeight='1.3'
        mobile={{ fontSize:'52px' }}
        fontWeight='500'
        letterSpacing='1.01px'
        fontStyle='normal'
        color="black"
        // textTransform="uppercase"
        // textAlign="center"
      />

      <TextStyle
        name='quizQuestion'
        fontFamily='Finlandica'
        fontFamilyDefault='sans-serif'
        fontSize='22'
        lineHeight='1.3'
        mobile={{ fontSize:'52px' }}
        fontWeight='400'
        letterSpacing='1.01px'
        fontStyle='normal'
        color="black"
        // textTransform="uppercase"
        // textAlign="center"
      />

      <TextStyle
        name='quizAnswer'
        fontFamily='Finlandica'
        fontFamilyDefault='sans-serif'
        fontSize='20'
        lineHeight='1.3'
        mobile={{ fontSize:'52px' }}
        fontWeight='500'
        letterSpacing='1.01px'
        fontStyle='normal'
        color="white"
        // textAlign="center"
      />

      <TextStyle
        name='quizAnswerBtn'
        fontFamily='Finlandica'
        fontFamilyDefault='sans-serif'
        fontSize='20'
        lineHeight='1.3'
        mobile={{ fontSize:'52px' }}
        fontWeight='500'
        letterSpacing='1.01px'
        fontStyle='normal'
        color="black"
        // textAlign="center"
      />

      <TextStyle
        name='iceFacto'
        fontFamily='Finlandica'
        fontFamilyDefault='sans-serif'
        fontSize='80'
        lineHeight='1.3'
        mobile={{ fontSize:'52px' }}
        fontWeight='400'
        letterSpacing='1.01px'
        fontStyle='normal'
        color={colors.blue}
        // textAlign="center"
      />

      <TextStyle
        name='iceText'
        fontFamily='Finlandica'
        fontFamilyDefault='sans-serif'
        fontSize='20'
        lineHeight='1.3'
        mobile={{ fontSize:'52px' }}
        fontWeight='500'
        letterSpacing='1.01px'
        fontStyle='normal'
        color="black"
        // textAlign="center"
      />

      <TextStyle
        name='cardsTitle'
        fontFamily='Finlandica'
        fontFamilyDefault='sans-serif'
        fontSize='36'
        lineHeight='1.3'
        mobile={{ fontSize:'52px' }}
        fontWeight='400'
        letterSpacing='1.01px'
        fontStyle='normal'
        color="black"
        // textTransform="uppercase"
        // textAlign="center"
      />      

      <TextStyle
        name='cardsDesc'
        fontFamily='Finlandica'
        fontFamilyDefault='sans-serif'
        fontSize='22'
        lineHeight='1.3'
        mobile={{ fontSize:'52px' }}
        fontWeight='400'
        letterSpacing='1.01px'
        fontStyle='normal'
        color="black"
        // textTransform="uppercase"
        // textAlign="center"
      />


      <TextStyle
        name='cardTitle'
        fontFamily='Finlandica'
        fontFamilyDefault='sans-serif'
        fontSize='20'
        lineHeight='1.3'
        mobile={{ fontSize:'52px' }}
        fontWeight='500'
        letterSpacing='1.01px'
        fontStyle='normal'
        color="black"
        // textTransform="uppercase"
        // textAlign="center"
      />      

      <TextStyle
        name='cardDesc'
        fontFamily='Finlandica'
        fontFamilyDefault='sans-serif'
        fontSize='18'
        lineHeight='1.3'
        mobile={{ fontSize:'52px' }}
        fontWeight='400'
        letterSpacing='1.01px'
        fontStyle='normal'
        color="black"
        // textTransform="uppercase"
        // textAlign="center"
      />

    </>
  );
}

export default Setup;
