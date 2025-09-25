import type { AbstractCNode } from "cnode";
import { AfterInit, Init, makeMixer, qoop } from "qoop";
import type { SectionParams } from "./Section";

@qoop({AutoInit:{}, Trait: {}})
export class PartsHolder{

  @Init() declare protected owner: AbstractCNode;

  private _containers: Map<string, AbstractCNode[]> = new Map([
    ['title'  , []],
    ['header' , []],
    ['footer' , []],
    ['article', []],
    ['headNav', []],
    ['footNav', []] ]);

  @AfterInit() protected ['_ * init children _* '](params: SectionParams){
    for(const f of 'title header article footer headNav footNav'.split(" ")){
      const children = (params as any)[f] ?? [];
      this.addChildren(f, ... children);
    }
  }

  addChildren( name: string, ... children: AbstractCNode[] ){
    this.owner.requiresAlive();
    const slot = this._containers.has(name) ? this._containers.get(name)! : (()=>{
      //console.warn(this._containers);
      throw new Error(`slot '${name}' wasn't defined.`);
      /* TODO: for SemmanticCNode (future candidate of the super-class of this class)
      const R:ICNodeComponent[] = [];
      this._containers.set(name, R);
      return R;
       */
    })();
    for(const c of children) c.setParent(this.owner);
    slot.push(... children);
  }

  get children(){
    this.owner.requiresAlive();
    return  this._containers.values();
  }

  async fillValues(get: (key: string) => unknown): Promise<void> {
    await this.owner.assertAvailable();
    await Promise.all(this._containers.values().toArray()
      .map(slot => slot.map(c=>c.fillValues(get))).flat());
  }

  removeChild( name: string, test: (_:AbstractCNode)=>boolean){
    this.owner.requiresAlive();
    const slot = this._containers.get(name);
    if(!slot) throw new Error();
    this._containers.set(name, slot.filter(c => !test(c)));
  }

  getChildrenIn( name: string ){
    this.owner.requiresAlive();
    const slot = this._containers.get(name);
    if(!slot) throw new Error();
    return slot;
  }

  get header (){ this.owner.requiresAlive(); return this.getChildrenIn('header');  }
  get article(){ this.owner.requiresAlive(); return this.getChildrenIn('article'); }
  get footer (){ this.owner.requiresAlive(); return this.getChildrenIn('footer');  }
  get headNav(){ this.owner.requiresAlive(); return this.getChildrenIn('headNav'); }
  get footNav(){ this.owner.requiresAlive(); return this.getChildrenIn('footNav'); }
  get title  (){ this.owner.requiresAlive(); return this.getChildrenIn('title');   }

}

export const TPartsHolder = makeMixer<PartsHolder>(PartsHolder);
