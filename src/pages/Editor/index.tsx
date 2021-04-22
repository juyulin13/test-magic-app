import React, { useState } from 'react';
import { WegetSelectArea, JsonEditor } from '../../components'
import { Button, Card, Layout } from 'antd';
import { Preview } from '../../core/preview/container'
import { initalData } from './initalData'


export default () => {

  const [value, setValue ] = useState(initalData)
  const weigetDatasource = [{
    id: 1,
    category: '视图',
    children: [{
      id: 2,
      title: '基础布局',
      name: 'View'
    }, {
      id: 3,
      title: '网格布局',
      name: 'GridView'
    }]
  }]
  return (
    <Layout
    >
      <Layout.Sider width='500px' style={{height: '100vh'}}>
          <JsonEditor
            onChange={(v) => {
              setValue(v.jsObject)
            }}
            initialValue={initalData}
          />
        
      </Layout.Sider>

      <Layout.Content>
        <Preview 
          value={value}
        />

      </Layout.Content>
      {/* <div style={{width: '400px'}}>
        <WegetSelectArea dataSource={weigetDatasource} />
      </div> */}
    </Layout>
  )
}