import React from 'react';
import { Row as AntRow , Col as AntdCol } from 'antd';


export const Row: React.FC<any> = (props) => {
  const { children, ...restProps } = props
  return (
    <AntRow {...restProps}> 
      {children}
    </AntRow>
  )
}

export const Col: React.FC<any> = (props) => {
  const { children, ...restProps } = props
  return (
    <AntdCol {...restProps}> 
      {children}
    </AntdCol>
  )
}
