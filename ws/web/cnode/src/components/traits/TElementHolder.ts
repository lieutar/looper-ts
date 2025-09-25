import { AutoInit, Init,  makeMixer,  qoop, Trait} from "qoop";
import type { AbstractCNode } from "../AbstractCNode";
/*
export interface IElementHolder {
get element() : Element;
getWholeNodes(): Promise<Node>;
getFirstNode(): Promise<Node>;
getLastNode(): Promise<Node>;
dispose(): Promise<void>;
purgeManagedNodesFromParent(): Promise<void>;
}
 */
export interface ElementHolderParams { element?:Element | null }

@AutoInit()
@Trait()
@qoop()
export class ElementHolder{

  /*
  static applyFeature(Base: Constructor<AbstractCNode>){
    const {self, d} = fMixinTools(ElementHolder as IFeatureClass<IElementHolder>);

    return class extends Base {
      get element(){ return self(this).element as Element }
      override getWholeNodes    = d('getWholeNodes') as () => Promise<Node[]>;
      override getFirstNode     = d('getFirstNode')  as () => Promise<Node>;
      override getLastNode      = d('getLastNode')   as () => Promise<Node>;
      override purgeManagedNodesFromParent = d('purgeManagedNodesFromParent') as () => Promise<void>;
      override async dispose(){
        await d('dispose')();
        await super.dispose();
      }

      constructor(... args:any[]){
        console.log('EH->super');
        super(... args);
        console.log('super->EH');
        const [params] = args as [ElementHolderParams];
        const f = new ElementHolder();
        f.inject(this);
        if(params.element) f._setElement(params.element);
      }
    }
  }
   */


  @Init() declare protected owner: AbstractCNode

  _init(params:ElementHolderParams){
    if(params.element) this._setElement(params.element);
  }

  protected _setElement(node: Element){
    this.owner.manager.bindComponent(this.owner, node ); }

  protected get _element(): Element | null {
    const node = this.owner.manager.getNode(this.owner);
    return node as Element ?? null; }

  get element() {
    const node = this._element;
    if(!node) throw new Error();
    return node; }

  async getWholeNodes() {
    await this.owner.assertAvailable();
    return [ this.element ]; }

  async getFirstNode(){
    await this.owner.assertAvailable();
    return this.element; }

  async getLastNode(){
    await this.owner.assertAvailable();
    return this.element; }

  async purgeManagedNodesFromParent(){
    await this.owner.assertAvailable();
    const element = this.element;
    if(!element) return;
    const parent = element.parentElement;
    if(!parent) return;
    parent.removeChild(element); }

  async dispose() {
    await this.owner.assertAvailable();
    await this.purgeManagedNodesFromParent();
    this.owner.manager.unbindComponent(this.owner); }

}


export const TElementHolder = makeMixer<Omit<ElementHolder, '_init'>>(ElementHolder);
