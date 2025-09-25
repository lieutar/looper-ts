import { Init, LazyInit, qoop, } from "qoop";
import type { StyloSheet } from "./types";

type ZLayerChildrenType = {[pos:number]:ZLayer};

export interface ZLayerProps {
  isBg: boolean;
  parent: ZLayer | null;
  bgLayers: ZLayerChildrenType;
  fgLayers: ZLayerChildrenType;
}

@qoop({AutoInit:{}})
export class ZLayer{

  @Init({default: null}) declare parent  :ZLayer;
  get isRoot():boolean { return this.parent === null; }
  get root():ZLayer    { return this.isRoot ? this : this.parent.root; }

  @Init({default: false}) declare isBg    :boolean;
  get isFg(){ return !this.isRoot && !this.isBg; }

  @Init({makeDefault(){return {}}}) declare readonly fgLayers:ZLayerChildrenType;
  @Init({makeDefault(){return {}}}) declare readonly bgLayers:ZLayerChildrenType;

  @LazyInit()
  get base(){ return new DZLayer(); }

  private _sorted(slot: 'fgLayers' | 'bgLayers'){
    return Object.entries(this[slot]).sort((a,b)=>a[0] === b[0] ? 0 : (a[0] < b[0] ? -1 : 1)).map(p=>p[1]); }


  getSortedBgLayers():ZLayer[]{ return this._sorted('bgLayers').reverse(); }
  getSortedFgLayers():ZLayer[]{ return this._sorted('fgLayers'); }

  getSerializedBgLayers():ZLayer[]{ return this.getSortedBgLayers().map(l => l.getSerializedLayers()).flat() }
  getSerializedFgLayers():ZLayer[]{ return this.getSortedFgLayers().map(l => l.getSerializedLayers()).flat() }

  getSerializedLayers():ZLayer[] {
    return [
      ... this.getSerializedBgLayers(),
      this,
      ... this.getSerializedFgLayers()
    ];
  }

  get index():number{

    if(this.isBg){
      const bgs = this.root.getSerializedBgLayers().reverse();
      let i = -1;
      for(const l of bgs){
        if ( l === this ) return i;
        i--;
      }
      throw new Error('This is a background layer but not found.');
    }else if(this.isFg){
      const fgs = this.root.getSerializedFgLayers();
      let i = 1;
      for(const l of fgs){
        if( l === this ) return i;
        i++;
      }
      throw new Error('This is a foreground layer but not found.');
    }else{
      return 0;
    }
  }

  position(pos:'relative' | 'absolute' | 'fixed' | 'sticky', opt:{before?:StyloSheet, after?:StyloSheet}={}): StyloSheet{
    const inc = (pos:'before'|'after') => {
      const styles = opt[pos];
      if(!styles) return {};
      return { [`&::${pos}`] : {
        position: 'absolute',
        zIndex: '-1',
        content: '""',
        width: '100%',
        height: '100%',
        ... styles
      } };
    };
    return {
      position: pos,
      zIndex: String(this.index),
      ... inc('before'),
      ... inc('after')
    }
  }

  private _child(slot: 'fgLayers' | 'bgLayers', index: number):ZLayer{
    if(index == 0) return this;
    const isBg = this.isBg || this.isRoot && slot === 'bgLayers';
    const dict = this[slot];
    if(!dict[index])  dict[index] = new DZLayer({parent: this, isBg});
    return dict[index];
  }

  fg(index = 1):ZLayer{ return this._child('fgLayers', index); }
  bg(index = 1):ZLayer{ return this._child('bgLayers', index); }

  constructor(_params: Partial<ZLayerProps> = {}){}
  //@AfterInit() [ '' ](){ console.log('AfterInit >>> ', this, '\n<<<'); }
  static base(){ return new this(); }
}

const DZLayer = ZLayer;
