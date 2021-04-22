import React, { useEffect, useMemo, useState } from 'react';
import { Form as AntdForm } from 'antd'
import { Subject } from 'rxjs';
export const Form: React.FC<any>  = React.forwardRef((props, ref) => {

  const [form] = AntdForm.useForm()
  const state$ = useMemo(() => {
    return new Subject()
  }, [])
  
  return (
    <AntdForm 
      form={form}
      onValuesChange={(changedValues, value) => {
        state$.next({
          type: changedValues,
          payload: changedValues
        })
      }}>
      {props.children}
    </AntdForm>
  )
})
export default {}