import React from 'react';
import { WegetSelectArea } from '../../components'
import { Preview } from '../../core/preview/container'

export default () => {
  const weigetDatasource=  [{
    id: 1,
    category: '视图',
    children: [{
      id: 2,
      title: '基础布局',
      name: 'View'
    },{
      id: 3,
      title: '网格布局',
      name: 'GridView'
    }]
  }]
  return (
    <div
      style={{display: 'flex'}}
    >
      <div style={{width: '300px'}}>
        <WegetSelectArea dataSource={weigetDatasource} />
      </div>
      <div style={{width: 'calc(100vw - 700px)'}}>
      </div>
      <div style={{width: '400px'}}>
        <WegetSelectArea dataSource={weigetDatasource} />
      </div>
      </div>
  )
}