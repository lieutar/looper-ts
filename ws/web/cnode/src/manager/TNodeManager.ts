import { makeMixer, qoop } from "qoop";
import type { AbstractCNode } from "../components";
import { isElementNode } from "domlib";

@qoop({Trait:{},AutoInit:{}})
export class NodeManager {

  private _d2c : WeakMap<Node, AbstractCNode> = new WeakMap();
  private _c2d : WeakMap<AbstractCNode, Node> = new WeakMap();
  getComponent( n: Node ):AbstractCNode | null { return this._d2c.get(n) || null; }
  getNode( c: AbstractCNode ):Node | null { return this._c2d.get(c) || null; }
  bindComponent( c: AbstractCNode, n: Node ){
    if( this._c2d.has(c) || this._d2c.has(n) ) throw new Error();
    if( isElementNode(n) ) n.setAttribute('data-cnode-id', c.id);
    this._c2d.set( c, n );
    this._d2c.set( n, c );
  }

  unbindComponent( c: AbstractCNode ) {
    if( !this._c2d.has(c) ) throw new Error();
    const n = this._c2d.get(c);
    this._c2d.delete(c);
    if(n) this._d2c.delete(n);
  }
}

export const TNodeManager = makeMixer<NodeManager>(NodeManager);
