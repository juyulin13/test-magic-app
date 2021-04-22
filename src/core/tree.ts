
import { Context } from 'immutability-helper';
import _ from 'lodash'

interface Node {
  id: string;
  parent?: string;
  name: string;
  defautProps: any;
  style: any
  children: string[]
}
interface Weiget {

}

function buildRootTree(nodes: Node[]) {
  const root = _.find(nodes, node => !node.id)
  if(!root) {
    throw Error('Not Found Node')
  } 
  const  { children } = root;
  return {
    ...root,
    children: children.map((child) => buildTree(child, nodes))
  }
}
function findNodeById(id: string, nodes: Node[]) {
  return  _.find(nodes, ['id', id])
}
function buildTree(id: string, nodes: Node[]) {
  const node = findNodeById(id, nodes)
  const { children } = node;
  return {
    ...node,
    children: (children || []).map((child) => buildTree(child, nodes))
  }
}

interface Tree extends Omit<Node, 'children'>{
  children?: Tree[]
}

interface Effect {
  type: 'UPDATE' | 'DELETE'
  state: any,
  next: Effect
}

export class NodeTree {
  nodes: Node[];

  // effect?: Effect;
  // lastEffect?: Effect
  constructor(nodes: Node[]) {
    this.nodes = nodes
  }
  get tree(): Tree {
    const { nodes } = this;
    return buildRootTree(nodes)
  }

  
  
  deleteNode = (id: string) => {
    this.nodes = this.nodes.filter(({id}) => {

    })
  }

  // addEffect = (effect: Effect) => {
  //   if(this.effect) {
  //     this.lastEffect.next = effect
  //     this.lastEffect = this.lastEffect.next;
  //     this.lastEffect.next = this.effect;
  //   } else {
  //     this.effect = effect;
  //     this.lastEffect = effect;
  //     this.effect.next = this.lastEffect;
  //   }
  // }
  // schedule = () => {

  // }
}



