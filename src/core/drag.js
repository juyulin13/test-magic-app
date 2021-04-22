class Drag {
  params = {}

  // 声明
  mouseOffsetBottom = 0;
  mouseOffsetRight = 0;

  init = (params) => {
    const { dragEle, dropEle } = params;
    this.initDrag(dragEle);
    this.initDrop(dropEle)
  };
  //初始化设置拖动元素
  initDrag = dragEle => {
    if (dragEle.childNodes.length) {
      const { length } = dragEle.childNodes;
      let i = 0
      while (i < length) {
        this.setDrag(dragEle.childNodes[i]);
        i += 1;
      }
    } else {
      this.setDrag(dragEle);
    }

  }
  //初始化释放区
  initDrop = dropEle => {
    if (dropEle.childNodes.length) {
      const { length } = dropEle.childNodes;
      let i = 0;
      while (i < length) {
        this.setDrop(dropEle.childNodes[i]);
        i += 1;
      }
    } else {
      this.setDrop(dropEle);
    }

  }
  //拖动元素注册事件
  setDrag = el => {
    el.setAttribute("draggable", "true");
    el.ondragstart = this.dragStartEvent;
    el.ondrag = this.dragEvent;
    el.ondragend = this.dragEndEvent;

  };
  //释放区注册事件
  setDrop = el => {
    el.ondrop = this.dropEvent;
    el.ondragenter = this.dragEnterEvent;
    el.ondragover = this.dragOverEvent;
    el.ondragleave = this.dragLeaveEvent;


  }

  //获取iframe的位置
  getIframeOffset = () => {
    const iframeEle = this.getIframe();
    return iframeEle
      ? this.getRealOffset(iframeEle)
      : { offsetLeft: 0, offsetTop: 0 };
  };

  //递归计算元素距离父元素的offset
  getRealOffset = (el, parentName) => {
    let left = el.offsetLeft;
    let top = el.offsetTop;
    if (el.offsetParent && el.offsetParent.tagName !== parentName) {
      const p = this.getRealOffset(el.offsetParent, parentName);
      left += p.offsetLeft;
      top += p.offsetTop;
    }
    return { offsetLeft: left, offsetTop: top };
  }

  //获取元素位置
  getElOffset = el => {
    const { offsetTop: iframeTop } = this.getIframeOffset();
    const { offsetTop: targetOffsetTop } = this.getRealOffset(el);
    return {
      midLine: el.clientHeight / 2 + targetOffsetTop + iframeTop,
      topLine: targetOffsetTop + iframeTop,
      bottomLine: el.clientHeight + targetOffsetTop + iframeTop
    };
  };

  //释放区内部元素位置
  getDropOffset = () => {
    const result = [];
    const { dropEle } = this.params;
    const el = dropEle.childNodes;

    let i = 0;
    while (i < el.length) {
      const midLine = this.getElOffset(el[i]);
      result.push(midLine);
      i += 1;
    }
    return result;
  };

  //位置比较
  locationCompare = (ev) => {
    let inside = false;
    const { dropEle } = this.params;
    console.log(ev.clientX);
    // 拖动元素的位置
    const sourceRight = ev.clientX + this.mouseOffsetRight;
    const sourceLeft = sourceRight - ev.currentTarget.clientWidth;

    const { offsetLeft: iframeLeft } = this.getIframeOffset();
    const { offsetLeft: targetLeft } = this.getRealOffset(dropEle);

    /*释放区的位置*/
    const targetOffsetLeft = iframeLeft + targetLeft;
    const targetOffsetRight = targetOffsetLeft + dropEle.clientWidth;

    if (sourceRight > targetOffsetLeft && sourceLeft < targetOffsetRight) {
      //拖动到释放区
      inside = true;
    } else {
      //释放区外面
      inside = false;
    }
    return inside;

  }

  //插入占位元素
  insertPlaceholderEle = (sourceMidLine) => {
    const dropOffset = this.getDropOffset(); //释放区的位置属性
    const insertEl = this.createElePlaceholder();
    const { dropEle } = this.params;
    const dropEleChild = dropEle.childNodes;
    if (dropOffset.length) {
      dropOffset.map((item, i) => {
        const Ele = dropEleChild[i];
        //在元素前面插入占位元素
        if (sourceMidLine > item.topLine && sourceMidLine < item.midLine) {
          Ele.before(insertEl);
        }
        //在元素后面插入占位元素
        if (sourceMidLine < item.bottomLine && sourceMidLine > item.midLine) {
          this.index = i + 1;
          Ele.after(insertEl);
        }
        //追加一个占位元素
        if (sourceMidLine > dropOffset[dropOffset.length - 1].bottomLine) {
          dropEle.append(insertEl);
        }
        return item;
      });
    }
    //插入第一个占位元素（当iframe内部没有组件）
    if (!dropEleChild.length) {
      dropEle.append(insertEl);
    }
  }

  /****** 事件处理 ******/
  dragStartEvent = ev => {
    // console.log('开始拖拽');
    //获得鼠标距离拖拽元素的下边的距离
    this.mouseOffsetBottom = ev.currentTarget.clientHeight - ev.offsetY;
    //获得鼠标距离拖拽元素的右边的距离
    this.mouseOffsetRight = ev.currentTarget.clientWidth - ev.offsetX;
  };

  dragEvent = ev => {
    //获取拖拽元素中线距离屏幕上方的距离
    const sourceMidLine =
      ev.clientY + this.mouseOffsetBottom - ev.currentTarget.clientHeight / 2;
    if (this.locationCompare(ev)) {
      this.insertPlaceholderEle(sourceMidLine)
      console.log('释放区内部')
    } else {
      this.removePlaceholderEle()
      console.log('释放区外面')
    }
  };
}

export default new Drag();