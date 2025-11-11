import React from 'react'
import Base from './base'
import { localizeUrl } from '@ips/app/utils'
import carryUnions from '@ips/typo/carry-unions'
import "./fig.styl"

export class Fig extends Base{

    created(){
        super.created()

        this.$img.onload = ()=>{
            this.setState({ realImgHeight: this.$img.height })
        }        
    }

    render(){
        const { src, caption, style, imgStyle } = this.cprops

        // trace('galifan', 'karmano', this, this.cprops)

        const p = this.props
        const s = this.state

        return <figure className={`fig ${ s.className||p.className||'' }`} style={ style }>
                    <div className="fig__imgcon"><img ref={ ref => this.$img = ref } style={ imgStyle } src={ src } alt=""/></div>
                    { caption ? 
                        <figcaption className="fig__caption" dangerouslySetInnerHTML={{ __html: caption }}></figcaption>
                        : null
                    }
                </figure>
    }

    recalc(props){
        const { className, src, caption, position, height, imgHeight, imgWidth } = props
        const { realImgHeight } = this.state||{}

        // trace('imgWidth', imgWidth)

        return {
            src: localizeUrl(src,  { path: 'img', usePrefixDir:true }),
            caption: carryUnions(caption||''),
            style: { position: (position ? 'relative' : ''), height:(position ? (height||realImgHeight):'') },
            imgStyle:(()=>{ 
              let s = {}
              if(height||imgHeight){
                s.position = 'absolute'
                s.height = imgHeight
              }
              else
              if(imgWidth){
                s.position = 'absolute'
                s.width = imgWidth
              }
              else
                s.width = '100%'
                
              if(position == 'left')
                s.left = '0px'
              else
              if(position == 'right')
                s.right = '0px'
              return s;
            })(),                        
        }
    }
}

// props:[
//     "src",
//     "classname",
//     "caption",
//     "position",
//     "height",
//     "imgheight"
// ],

export default Fig