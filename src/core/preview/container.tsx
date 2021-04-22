import React, { useState } from 'react';
import * as _ from 'lodash';
import classnames from 'classnames';
import Frame from 'react-frame-component';
import { createWeiget } from '../createWeiget'

import styles from './index.module.scss';
import { OpenAPIV3 } from '../types/schema';

interface NodeState {
  nodeType: 'state' | 'props' | 'constant';  
}
interface StateNode {
  nodeType: 'STATE';
  value: {
    oneOf: [OpenAPIV3.NonArraySchemaObjectType, ]
  }
}



interface Node {
  id: string;
  title: string;
  isolated?: boolean;
  children?: [];
  defaultState?: any;
  defaultProps?: any;

  state?: {
    [key: string]: {
      key: string;
      index: number;
      title: string;
      defaultValue?: any
    }
  };
  services?: {
   [key: string]: {
      key: string;
      id: string;
      sourceId: string;
      defaultPrams: {

      }
   }

  },
  props?: {
    [key: string]: {
      key: string;
      index: number;
      title: string;
      defaultValue?: any
    }
  }
  actions?: {

  },
  effects?: [{
    name: string;
    dependencies: []
  }]

}


class NodeeStore {
  _store: Node
  constructor(initialValue: Node) {
    this._store = initialValue
  }
  find = (path: string[]) => {
    return _.get(this._store, path)
  }
  remove = (path: string[]) => {
    const parentPath = path.slice(0, path.length);
    return _.update(this._store, parentPath,(value) => {
      return _.remove(value, ['id', path[path.length - 1]])
    })
  }
  update = (path: string[], data) => {
    const parentPath = path.slice(0, path.length - 1);
    return _.update(this._store, parentPath,(value) => {
      return _.filter(value, ['id', path[path.length - 1]])
    })
  }

  insert = (path: string[], index, data) => {
    return _.update(this._store, path, (v) => {
      return [_.slice(v, 0, index),data, _.slice(v, index, v.length)]
    })
  }
  


}

interface PreviewProps {
  value: any
}

export const Preview: React.FC<PreviewProps> = ({value}) => {
  return createWeiget(value)()
}