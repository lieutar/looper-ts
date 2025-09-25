import { Init, qoop } from "qoop";
import { camelToKebab } from "case-shift";
import type { StyloSheet } from './types';

export interface StyloProps {
  selector: string,
  raw: StyloSheet,
};

@qoop({AutoInit:{}})
export class Stylo {
  @Init() declare selector: string;
  @Init() declare raw:StyloSheet;

  constructor(_params: StyloProps){ }

  include(... someStyles:StyloSheet[]):void{
    const raw = this.raw;
    for(const styles of someStyles){
      for(const [key, value] of Object.entries(styles)) raw[key] = value;
    }
  }

  private _children:{[selector:string]:Stylo} = {};

  get styles():StyloSheet{
    return { [this.selector] : {
      ... this.raw,
      ... Object.assign({}, ... Object.values(this._children).map(c=>{
        if(this.selector.match(/^\s*@/)) return c.styles;
        const R = {} as StyloSheet;
        for(const [key, value] of Object.entries(c.styles)) R[`& ${key}`] = value;
        //console.log(R);
        return R;
      }))
    }};}

  child(selector: string, raw: StyloSheet = {}){
    const child = new DStylo({selector, raw});
    this._children[selector] = child;
    return child;
  }

  with(selector: string, raw: StyloSheet = {}){
    this.child(selector, raw);
    return this;
  }

  q(... [head, ... rest]: string[]):Stylo{
    if(head === undefined) return this;
    const child = this._children[head];
    if(!child) throw new Error(`Undefined child: '${head}'.`);
    return child.q(... rest); }

  static with(selector: string, raw: StyloSheet = {}):Stylo{ return new DStylo({selector, raw}); }
  static global(){ return Stylo.with('@global'); }

  toString(prefix:string = ''):string{
    const dump = (selector:string, src:StyloSheet):string => {
      const buf = [];
      const sub = [];
      for(const [prop, value] of Object.entries(src)){
        if(!value){
          continue;
        } else if('object' === typeof value){
          sub.push(dump(prop.replace(/^\s*&?/, selector), value as StyloSheet));
        }else{
          buf.push('  ' + camelToKebab(prop).toLowerCase() + ": " + value + ';');
        }
      }
      return [... (buf.length > 0 ? [selector.replace(/^\s*@global\s*/,'') + "{", ... buf, '}\n'] : []),
        ... sub].join("\n");
    };
    return dump(prefix + this.selector, this.raw) + "\n" +
      Object.values(this._children).map(c => c.toString(this.selector + " ")).join("\n");
  }
}
const DStylo = Stylo;
