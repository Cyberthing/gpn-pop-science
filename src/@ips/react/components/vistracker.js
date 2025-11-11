import React from 'react'
import Inject from './vistracker-inject'

export const VisTracker = (props)=><div className="vistracker">
                            { props.children }
                            <Inject name={ props.name } top={ props.top } bottom={ props.bottom } action={ props.action }/>
                        </div>


//        props:['name', 'top', 'bottom'],

export default VisTracker