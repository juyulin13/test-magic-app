import React, { useState, useEffect } from 'react';
import Drag from './drag.js';
 
require('./styles.less');
 
//iframe hooks
const useIframeLoad = () => {
  const [iframeState, setIframeState] = useState(false);
  const [windowState, setWindowState] = useState( document.readyState === "complete");
 
  const iframeLoad = () => {
    const iframeEle = document.getElementById("my-iframe");
    iframeEle && setIframeState(iframeEle.contentDocument.readyState === "complete");
    if (!iframeState && iframeEle) {
      iframeEle.onload = () => {
        setIframeState(true);
      };
    }
  };
  useEffect(() => {
    if (!windowState) {
      setIframeState(false);
      window.addEventListener('load', () => {
        setWindowState(true);
        iframeLoad();
      })
    } else {
      iframeLoad();
    }
  }, []);
  return iframeState;
}


export default () => {
 
    const init = () => {
      Drag.init({
        dragEle: document.getElementById('drag-box'),
        dropEle: document.getElementById('my-iframe').contentDocument.getElementById('drop-box')
      })
    }
   
    useIframeLoad() && init();
   
    return <>
      <div id="drag-box">
        <div className="drag-item">拖动元素</div>
        <div className="drag-item">拖动元素</div>
        <div className="drag-item">拖动元素</div>
      </div>
      <div className="drop-content">
        <iframe id="my-iframe" src="#/iframe" style={{ width: "100%", height: "480px", border: "none" }}/>
      </div>
    </>
}