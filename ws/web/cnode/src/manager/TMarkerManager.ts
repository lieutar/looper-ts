import { Init, makeMixer, qoop } from "qoop";
import type { Placeholder } from "../components";
import { asElement, isElementNode } from "domlib";
import type { CNodeManager } from "./CNodeManager";

@qoop({Trait:{}, AutoInit:{}})
export class MarkerManager{

  @Init() declare owner: CNodeManager;

  private _mk2ph : WeakMap<Node, Placeholder> = new WeakMap();
  private _ph2mk : WeakMap<Placeholder, {begin: Node, end: Node}> = new WeakMap();
  bindPlaceholder( ph: Placeholder, begin: Node, end: Node){
    if( this._mk2ph.has(begin) || this._mk2ph.has(end) || this._ph2mk.has(ph) ) throw new Error();
    if( isElementNode(begin) ) begin.setAttribute('data-cnode-id', ph.id);
    if( isElementNode(end)   ) end.setAttribute('data-cnode-id', ph.id);
    this._mk2ph.set( begin, ph );
    this._mk2ph.set( end,   ph );
    this._ph2mk.set( ph, {begin, end} );
  }

  unbindPlaceholder( ph: Placeholder ){
    if( ! this._ph2mk.has(ph) ) throw new Error();
    const {begin, end} = this._ph2mk.get(ph)!;
    this._ph2mk.delete(ph);
    this._mk2ph.delete(begin);
    this._mk2ph.delete(end);
  }

  makePlaceholderMarkers( name: string ): {begin: Element, end: Element} {
    const doc = this.owner.window.document;
    const prefix='application/x-cnode-ph-';
    return {
      begin: asElement(doc, ['script', {type: `${prefix}begin`, name: name}]),
      end:   asElement(doc, ['script', {type: `${prefix}end`,   name: name}])
    };
  }

  getPlaceholderMarkers( ph: Placeholder ) : {begin: Node, end: Node} | null{
    return this._ph2mk.get(ph) || null; }

  getPlaceholder( n: Node ) : Placeholder | null{
    return this._mk2ph.get(n) || null; }
}

export const TMarkerManager = makeMixer<MarkerManager>(MarkerManager);
