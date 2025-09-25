import { Init, makeMixer, qoop, } from "qoop";
import type { AbstractCNode } from ".";

@qoop({AutoInit:{}, Trait:{}})
export class OriginalHolder {
  @Init() declare owner: AbstractCNode;
  @Init('original') private _original: AbstractCNode| null = null;
  get original(){ return this._original ?? this.owner; }
  setOriginal(original: AbstractCNode){ this._original = original; }
}

export const TOriginalHolder = makeMixer<OriginalHolder>(OriginalHolder)
