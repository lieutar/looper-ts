import { AbstractCNode } from "../AbstractCNode";
import { Init, makeMixer, qoop } from "qoop";
import type { TextCNodeDictType } from "./types";

@qoop({AutoInit:{}, Trait:{}})
export class TextCNodeOwner {

  @Init() declare protected owner: AbstractCNode & { children: AbstractCNode[] };

  // textcnodes
  @Init('textCNodes') declare private _textCNodes: TextCNodeDictType;
  get textCNodes(){
    this.owner.requiresAlive();
    return {... this._textCNodes};
  }

  async fillValues(get: (name:string)=>unknown){
    await this.owner.assertAvailable();
    for( const [name, tns] of Object.entries(this.textCNodes)){
      const value = get(name);
      const resolved = value instanceof Promise ? await value : value;
      if(resolved === null || resolved === undefined ) continue;
      for(const tn of tns.filter(tn => !tn.hasValue)) await tn.setValue( value );
    }
    await Promise.all(this.owner.children.map( c => {
      return c.fillValues(get) } ));
  }
  //
}

export const TTextCNodeOwner = makeMixer<Omit<TextCNodeOwner,'_init'>>(TextCNodeOwner);
