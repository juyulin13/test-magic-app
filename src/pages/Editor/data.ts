export const data = {
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