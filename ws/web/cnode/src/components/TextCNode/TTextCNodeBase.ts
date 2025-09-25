import { Init, InitTProp, makeMixer, qoop, } from "qoop";
import type { AbstractCNode } from "../AbstractCNode";

@qoop({Trait: {hide:(_:any)=>false}, AutoInit:{}})
export class TextCNodeBase {

  @Init() declare owner: AbstractCNode & {
    data:string;
    element: Element;
  };

  @InitTProp({default: String}) declare readonly formatter: (value:unknown)=>string;

  async _updateDOM(){
    this.owner.logger.debug('TextCNode#updateDOM', this.owner.data);
    const elem = this.owner.element;
    while(elem.firstChild) elem.removeChild( elem.firstChild );
    elem.appendChild(this.owner.manager.document.createTextNode(this.owner.data));
  }

  coerce(value:unknown):string{ return this.formatter(value); }

}

export const TTextCNodeBase = makeMixer<TextCNodeBase>(TextCNodeBase);
