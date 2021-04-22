interface ModalStateCreatorOptions {
  name?: string;
  initialState: {
    visible: boolean
  }
}

export const modalStateSchema = {
  state: {
    visible: {
      type: 'boolean',
      title: '弹窗开关状态',
    }
  },
  actions: {
    open: {
      title: '打开弹窗'
    },
    close: {
      title: '关闭弹窗'
    },
    toggle: {
      title: '切换弹窗开关状态'
    }
  }
}
export const modalStateCreator = (options: ModalStateCreatorOptions) => {
  const { name, initialState} = options;
  return {
    name,
    state: {
      ...initialState
    },
    reducers: {
      open: ['setTrue'],
      close: ['setFalse'],
      toggle: ['toggle']
    }
  }
}