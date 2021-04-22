
export const initalData = {
  services: {

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
          }
          // onClick: {
          //   $$type: 'serviceRun',
          //   value: 'queryUsers'
          // }
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