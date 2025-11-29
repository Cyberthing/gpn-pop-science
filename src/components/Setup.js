import React from 'react';
import { TextStyle } from '@ips/react/components/text-style';
import { GridStyle } from '@ips/react/components/layout';
import { colors } from '@/vars'
import { useScene } from '@ips/react/components/utils/use-scene';

const Setup = () => {

  const scene = useScene()

  return (
    <>
      <GridStyle 
        gutter='10' 
        gutterMobile='16' 
        maxWidth={1388}
        // padding={"85"}
        padding={scene.mobile?"":"26"}
        columns="9"
      />

      <TextStyle
        name='coverUptitle'
        fontFamily='PTRootUI'
        fontFamilyDefault='sans-serif'
        fontSize='30'
        lineHeight='1.2'
        mobile={{ fontSize:'22px' }}
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
        mobile={{ fontSize:'40px' }}
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
        mobile={{ fontSize:'16px' }}
        fontWeight='400'
        letterSpacing='1.01px'
        fontStyle='normal'
        color="white"
        textAlign="center"
      />
      <TextStyle
        name='articleTitle'
        fontFamily='PT Mono'
        fontFamilyDefault='sans-serif'
        fontSize='40'
        lineHeight='1.2'
        mobile={{ fontSize:'32px' }}
        fontWeight='700'
        letterSpacing='1.01px'
        fontStyle='normal'
        color={colors.green}
        // textAlign="center"
      />

      <TextStyle
        name='articleBody'
        fontFamily='PTRootUI'
        fontFamilyDefault='sans-serif'
        fontSize='18'
        lineHeight='1.38'
        mobile={{ fontSize:'16px' }}
        fontWeight='400'
        letterSpacing='1.01px'
        fontStyle='normal'
        color="white"
        // textAlign="center"
      />

      <TextStyle
        name='quoteDesc'
        fontFamily='PTRootUI'
        fontFamilyDefault='sans-serif'
        fontSize='17'
        lineHeight='1.38'
        mobile={{ fontSize:'16px' }}
        fontWeight='400'
        letterSpacing='1.01px'
        fontStyle='normal'
        color="white"
        // textAlign="center"
      />            

      <TextStyle
        name='quoteText'
        fontFamily='PT Mono'
        fontFamilyDefault='sans-serif'
        fontSize='22'
        lineHeight='1.3'
        mobile={{ fontSize:'16px' }}
        fontWeight='400'
        letterSpacing='1.01px'
        fontStyle='normal'
        color="white"
        // textAlign="center"
      />

      <TextStyle
        name='illDesc'
        fontFamily='PT Mono'
        fontFamilyDefault='sans-serif'
        fontSize='13'
        lineHeight='1.23'
        mobile={{ fontSize:'16px' }}
        fontWeight='400'
        letterSpacing='1.01px'
        fontStyle='normal'
        color={colors.green}
        // textAlign="center"
      />            

      <TextStyle
        name='track'
        fontFamily='PTRootUI'
        fontFamilyDefault='sans-serif'
        fontSize='14'
        lineHeight='1.215'
        mobile={{ fontSize:'16px' }}
        fontWeight='700'
        letterSpacing='1.01px'
        fontStyle='normal'
        color="#37D339"
        // textAlign="center"
      />       

    </>
  );
}

export default Setup;
