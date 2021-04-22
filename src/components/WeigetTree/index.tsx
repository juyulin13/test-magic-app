import React, { useEffect } from 'react';
import { Collapse, Space } from 'antd'
import { map } from 'lodash';
import './index.scss'
import { useDrop, useDrag } from '@umijs/hooks';
const { Panel } = Collapse;

interface Weiget {
 category: string;

 children: {
   id: number
   title: string
 }[]
}

interface WeigetSelectAreaProps {
  dataSource: Weiget[];
  loading?: boolean
}




const  Weiget: React.FC<any> = (props) =>{

  const dragProps = useDrag()(props.weigetId)
  return (
    <div className='weiget-item' {...dragProps}>
      {props.title}
    </div>
  )
}
export const WegetSelectArea: React.FC<WeigetSelectAreaProps> = (props) => {
  const { dataSource } = props;

  return (
    <div className='weiget-select-area'>
       <Collapse>
        {
          map(dataSource, ({category, children }) => {
            return (
              <Panel header={category} key={category}>
                <Space>
                  {
                    children.map((child, index) => {
                      return (
                        <Weiget 
                          key={index}
                          title={child.title}  
                          weigetId={child.id} 
                        />
                    
                      )
                    })
                  }
                </Space>
                
              </Panel>
            )
          })
        }
      </Collapse>

    </div>
   
  )
}