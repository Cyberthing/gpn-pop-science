import React, { forwardRef } from 'react'
import MediaBack from '@/components/MediaBack'
import { Overlay } from '@ips/react/components/overlay';

export const BackPlate = ({
  media = {},
  color,
}) => {
    trace('BackPlate', media, color)
    return <Overlay 
        // cover 
        className='backPlate'
        style={color?{
            '--backgroundColor': color
        }:null}
        
    >
        {/* <div className='backPlateInner'> */}
            {media && <MediaBack media={media}/> }
        {/* </div> */}
    </Overlay>
};

export default BackPlate;
