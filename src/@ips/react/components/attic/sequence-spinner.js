import React from 'react'
import ImageSequence from './image-sequence'
import Spinner from './spinner'
import DragTracker from './drag-tracker'

export const SequenceSpinner = 
    (props)=><div className="sequence-spinner">
                <ImageSequence spinner={ props.spinner } images={ props.images } current="eventPipe(dt, update, position)"/>
                <DragTracker name="dt"/> 
            </div>

export default SequenceSpinner