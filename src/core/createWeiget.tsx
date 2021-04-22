import React, { useCallback, useEffect, useMemo, useReducer, useState } from 'react';
import { Modal, Button, Table, Input, Select, Form as AntdForm, Card, message } from 'antd';
import * as _ from 'lodash'
import ServiceData from '../configs/services';
import { createMockService } from './weiget/service';
import { useRequest, useDrop, useDrag } from '@umijs/hooks'
import ResizeObserver from 'resize-observer-polyfill';
import { DragOutlined } from '@ant-design/icons';
import './preview.scss'
export interface PlanObject { 
  [key: string]: ConstantValue
}
export type ConstantValue = number | null | string | Array<ConstantValue> | PlanObject
export interface ConstantNode {
  nodeType: 'CONSTANT';
  value: PlanObject;
}
export interface RefNode {
  nodeType: 'RefNode';
  source: 'state' | 'stateAction';
  path: string[];
}


interface ExpressionNode {
  type: 'FunctionNode';

}

const ContainerPreviewEnhancer = (Component: any) =>  (props) => {
  // eslint-disable-next-line
  const [ dropProps, { isHovering } ] = useDrop({
    onDom: (content: string, e) => {
      console.log(content)
    }
  });
  return (
    <Component {...props} {...dropProps} className='preview-weiget-wrapper'>
      {props.children}
      <DragOutlined className='drag-icon' />

    </Component>
  )
}
export const PreviewEnhance = (weigiet : any) => (props) => {
  // eslint-disable-next-line 
  const [ dropProps, { isHovering } ] = useDrop({
    onDom: (content: string, e) => {
      console.log(content)
    }
  });
  // eslint-disable-next-line 
  const getDragProps = useDrag();
  return React.createElement(weigiet, {
      className: 'preview-weiget-wrapper',
      ...props,
      ...dropProps,
      ...getDragProps(weigiet.name)
    })
}


const Preview = () => {

}
const serviceActions: any = {};
type ServiceKeys = keyof typeof ServiceData;
Object.keys(ServiceData).map((serviceKey) => {
  serviceActions[serviceKey] = createMockService(ServiceData[serviceKey as ServiceKeys])
})
const Form = (props: any) => {
  return (
    <AntdForm {...props}>
      {React.Children.map(props.children, (child) => {
        const { isFormItem } = child.props.propsOptions.$$parentprops || {};
        if (!isFormItem) {
          return React.cloneElement(child, {
            $$parentprops: undefined
          })
        }
        const parentProps = _.omit(child.props.$$parentprops, ['isFormItem'])
        return <AntdForm.Item {...parentProps}>
          {React.cloneElement(child, {
            $$parentprops: undefined
          })}
        </AntdForm.Item>

      })}
    </AntdForm>
  )
}

const WeigetChild = {
  'Card': {
    title: '卡片',
    component: Card
  },
  'Form': {
    title: '表单',
    component: ContainerPreviewEnhancer(AntdForm),
    propsSchema: {

    }
  },
  'FormItem': {
    title: '表单项',
    component: ContainerPreviewEnhancer(AntdForm.Item),

  },

  'Table': {
    title: '表格',
    component: Table,
    propsSchema: {
      dataSource: {
        type: 'array',
        items: {
          type: 'object'
        }
      },
      loading: {
        type: 'boolean',
        default: false
      },
      columns: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            title: {
              type: 'string',
              required: true
            },
            dataIndex: {
              type: 'string',
              required: true
            }
          }
        }
      }
    }
  },
  'Select': {
    component: Select,
    propsSchema: {
      disabled: {
        type: 'boolean',
        default: false,
      },
      value: {
        type: 'string'
      },
      options: {
        type: 'object',
        properties: {
          label: {
            title: '展示',
            type: 'string',

          },
          value: {
            title: '值',
            type: 'string'
          },
        }
      }
    }
  },
  'Input': {
    component: Input,
    propsSchema: {
      disabled: {
        type: 'boolean',
        default: false,
      },
      value: {
        type: 'string',
      },

    }
  },
  'Modal': {
    component: Modal,
    title: '弹窗',
    propsSchema: {
      visible: {
        type: 'boolean',
      },
      title: {
        type: 'string',
      }
    },
    defaultActions: ['modalStateCreator']
  },
  'View': {
    title: '容器',
    name: 'div',
    component: 'div'
  },
  'Button': {
    title: '按钮',
    component: PreviewEnhance((props: any) => <Button {...props}>查询</Button>),
    propsSchema: {
      type: {
        type: 'enum',
        enum: ['primary', 'small'],
        default: 'primary'
      },
      onClick: {
        type: 'clickEvent'
      }
    }
  }
}

const reducerHelp = {
  toggle: (v: boolean) => {
    return !v
  },
  setTrue: () => {
    return true
  },
  setFalse: () => {
    return false
  },
  setValue: (v: any) => v
}


interface Action {
  type: string;
  payload?: any
}



type ReducerHelp = typeof reducerHelp
interface ObjectReducer {
  [key: string]: {
    title: string;
    handlers: Array<keyof ReducerHelp>
  }
}
function object2Reducer(objectReducer: ObjectReducer) {
  const actions = Object.keys(objectReducer);
  return (state: any, action: Action) => {
    const { type } = action;
    if (actions.includes(type)) {
      const handlers = objectReducer[type].handlers
      return handlers.reduce((pre, cur) => {
        return reducerHelp[cur](pre)
      }, action.payload)
    }
  }
}


type Reducer = (state: any, action: Action) => any;
interface ReducerObject {
  [key: string]: Reducer
}
function combineReducers(reducerObject: ReducerObject) {
  const reducerKeys = Object.keys(reducerObject);
  return (state: any, action: Action) => {
    const newState: any = { ...state };
    let tag = false;
    reducerKeys.forEach((reducerKey) => {
      const reducer = reducerObject[reducerKey];
      const curState = state[reducerKey]
      const types = action.type.split('/')
      if (types.shift() === reducerKey) {
        newState[reducerKey] = reducer(curState,
          {
            ...action, type: types.join('/')
          })
        if (newState[reducerKey] !== state[reducerKey]) {
          tag = true
        }
      }

    })
    if (tag) return newState
    else {
      return state
    }
  }
}



function computeSchemaDefaultValue(schema: any) {
  const { type } = schema;
  switch (type) {
    case 'array':
      return []
    case 'boolean':
      return schema.default || false;
    case 'object':
      return {}
    case 'number':
      return schema.defalut

  }
}

const data = {
  name: 'View',
  state: {
    modalVisibleState: {
      schema: {
        type: 'boolean',
        default: false
      },
      reducers: {
        toggle: {
          title: '切换',
          handlers: ['toggle']
        },

        setTrue: {
          title: '开',
          handlers: ['setTrue']
        },
        setFalse: {
          title: '关',
          handlers: ['setFalse']
        }
      }
    },
    inputDisabled: {
      schema: {
        type: 'boolean',
        default: false
      },
      reducers: {
        setValue: {
          'title': '设置值',
          handlers: ['setValue']
        }
      }
    }
  },
  children: [{
    name: 'View',
    children: [{
      name: 'Form',
      children: [{
        name: 'Input'
      }]
    }, {
      name: 'Button',
      propsOptions: {
        children: {
          $$type: 'constant',
          value: '打开'
        },
        onClick: {
          $$type: 'executions',
          value: [{
            $$source: 'action',
            path: ['modalVisibleState', 'setTrue']
          }]
        }
      }
    }, {
      name: 'Input',
      propsOptions: {
        disabled: {
          $$type: 'state',
          path: ['inputDisabled']
        }
      }
    }, {
      name: 'Select',
      propsOptions: {
        disabled: {
          $$type: 'constant',
          value: false
        },
        onChange: {
          $$type: 'executions',
          value: [{
            $$type: 'execution',
            $$source: 'state',
            path: ['inputDisabled', 'setValue']
          }]
        },
        options: {
          $$type: 'constant',

          value: [{
            label: '开',
            value: true
          }, {
            label: '关',
            value: false
          }]
        }
      }
    }, {
      name: 'Modal',
      propsOptions: {
        title: {
          $$type: 'constant',
          value: '编辑'
        },
        visible: {
          $$type: 'state',
          path: ['modalVisibleState']
        },
        onCancel: {
          $$type: 'executions',
          value: [{
            path: ['modalVisibleState', 'setFalse']
          }]
        },
        children: '3333'
      },
    }]
  }]
}

const formData = {
  services: {
    queryUsers: {
      service: serviceActions.queryUsers
    }
  },
  name: 'View',
  propsOptions: {
    style: {
     $$type: 'constant',
     value: {
      padding: '30px',
      background: '#ececec',
      height: '100vh'
     }
    }
  },
  children: [{
    name: 'Card',
    children: [{
      name: 'Form',
      propsOptions: {
        layout: {
          $$type: 'constant',
          value: 'inline'
        }
      },
      children: [{
        name: 'FormItem',
        propsOptions: {
          label: {
            $$type: 'constant',
            value: '姓名'
          },
          name: {
            $$type: 'constant',
            value: 'name'
          },
          labelCol: {
            $$type: 'constant',
            value: { span: 6 }
          },
          wrapperCol: {
            $$type: 'constant',
            value: { span: 18 }
          },
          
        },
        children: [{
          name: 'Input',
        }]
      }, {
        name: 'FormItem',
        propsOptions: {
          label: {
            $$type: 'constant',
            value: '地址'
          },
          name: {
            $$type: 'constant',
            value: 'address'
          },
          labelCol: {
            $$type: 'constant',
            value: { span: 6 }
          },
          wrapperCol: {
            $$type: 'constant',
            value: { span: 18 }
          },
          
        },
        children: [{
          name: 'Input',
        }]
      }, {
        name: 'Button',
        propsOptions: {
          $$parentprops: {
            $$type: 'constant',
            value: {
              isFormItem: false,
            }
          },
          children: {
            $$type: 'constant',
            value: '查询'
          },
          onClick: {
            $$type: 'serviceRun',
            value: 'queryUsers'
          }
        }

      }]
    }, {
      name: 'Table',
      propsOptions: {
        columns: {
          $$type: 'constant',
          value: [{
            title: '姓名',
            dataIndex: 'name'
          },{
            title: '年龄',
            dataIndex: 'age'
          }]
        },
        loading: {
          $$type: 'service',
          path: ['queryUsers','loading']
        },
        dataSource: {
          $$type: 'service',
          path: ['queryUsers', 'data','records']
        }
      }
    }]
  }]
}

const  PreviewContainer: React.FC<any> = (props) => {
  return (
    <>
      {props.children}
    </>
  )
} 
interface WeigetOptions {
  name: WeigetName;
  propsOptions: any;
  children: Array<WeigetOptions>
}
type WeigetName = keyof typeof WeigetChild



const renderElemetFactory = (state: any, actions: any, serviceState: any) => {
  const Render = React.forwardRef((options: WeigetOptions, ref): ReturnType<typeof React.createElement> => {
    const [ dropProps, { isHovering } ] = useDrop({
      onDom: (content: string, e) => {
        message.success(`custom: ${content} dropped`)
      }
    }); 
    const [state, setState] = useState(0)
    const { name, propsOptions, children } = options;
    const props: any = {};
    const getPropsValue = (option: any) => {
      const { $$type, value } = option;
      switch ($$type) {
        case 'constant':
          return option.value
        case 'executions':
          return (args: any) => {
            value.reduce((pre: any, cur: any) => {
              let func = _.get(actions, cur.path)
              return func(pre)
            }, args)
          }
        case 'service': 
          return _.get(serviceState.fetches, option.path)
        case 'state':
          return _.get(state, option.path)
        case 'serviceRun':
          return () => {
            return serviceState.run(option.value)
          }
        default:
          return null

      }
    }
    Object.keys(propsOptions || {}).forEach((key) => {
      props[key] = getPropsValue(propsOptions[key])
    })

    const observer = useMemo(() => {
      return new ResizeObserver(entries => {
        console.log(entries)
      });
    }, [])
    const weiget = WeigetChild[name]
    const reactChildren = children ? children.map((child) => {
      return <Render {...child} {...dropProps} />
    }) : []
    // const previewChildren = children ? children.map((child, index) => {
    //   return 
    // }) : [] 

    return React.createElement(weiget.component as any, {
      ...props,

    }, ...reactChildren)
  })
  return Render
}


interface StateOptions {
  [key: string]: {
    schema: any;
    title: string;
    reducers: {
      [key: string]: {
        title: string;
        handlers: Array<keyof ReducerHelp>
      }
    }
  }
}

function useCreateReducer(options: StateOptions) {
  const {
    reducer,
    initialState,
    actionCreator
  } = useMemo(() => {
    const initialState: any = {};
    const reducers: any = {};
    const actionTypes: any = {}
    Object.keys(options).forEach(key => {
      const stateKeyOption = options[key];
      const initialValue = computeSchemaDefaultValue(stateKeyOption.schema);
      initialState[key] = initialValue;
      reducers[key] = object2Reducer(stateKeyOption.reducers);
      actionTypes[key] = Object.keys(stateKeyOption.reducers)

    })
    return {
      initialState,
      reducer: combineReducers(reducers),
      actionCreator: (dispatch: any) => {
        const actions: any = {};
        Object.keys(actionTypes).forEach((namespace) => {
          actions[namespace] = {}
          actionTypes[namespace].forEach((name: string) => {
            actions[namespace][name] = (payload?: any) => {
              dispatch({
                type: `${namespace}/${name}`,
                payload
              })
            }
          })
        })
        return actions;
      }
    }
  }, [options])
  const [state, dispatch] = useReducer(reducer, initialState);
  return {
    state,
    actions: actionCreator(dispatch)
  }
}



export const createWeiget = (data: any) => () => {
  const { state, actions } = useCreateReducer(data.state || {});
  const servicesState: any = {};

  const services = useRequest(async (serviceKey: ServiceKeys, params: any) => {
    const service = serviceActions[serviceKey]
    const { data } = await service(params);
    return data
  }, {
    manual: true,
    fetchKey: (a) => {
      return a
    }
  })
  console.log(services,2332)
  const Render = renderElemetFactory(state, actions, services);
  
  return <Render {...data} />
}
export const App = createWeiget(formData)


