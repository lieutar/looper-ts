import type { ICNodeDSLComponentNode } from "../types";

export type AbstractComponentStubParamsType = {name?: string};

export class AbstractComponentStub implements ICNodeDSLComponentNode{
  get __brand_ICNodeDSLComponentNode(){ return true as true; }
  protected _params: AbstractComponentStubParamsType;
  get name(){ return this._params.name; }
  constructor(params: AbstractComponentStubParamsType){
    this._params = params;
  }
}
