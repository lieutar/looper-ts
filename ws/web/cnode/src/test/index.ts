import { Logger } from 'fancy-logger';
import { JSDOM } from 'jsdom';
import { CNodeManager } from '@src/manager';
import { asDomlibDSL, isTextNode, type IWindow, type NodeSpecType } from 'domlib';
import { DOM2DOMProcessor } from 'dom-processor';
import { expect, type Assertion } from 'vitest';
import type { AbstractCNode } from '@src/components';
import { InitTProp, LazyInit, makeMixer, qoop } from 'qoop';

export function makeManager(){
  const logger = new Logger({});
  const window = new JSDOM().window;
  return new CNodeManager({window, logger});
}

export function makeDataRemover(window:IWindow){
  return DOM2DOMProcessor.withRules(window,
    { when: isTextNode,
      action: n => n
    },
    { element: '*',
      action(node:Node){
        const e = node as Element;
        const r = e.ownerDocument.createElement(e.tagName);
        for(const a of e.attributes){
          if(a.localName.match(/^data-/)) continue;
          r.setAttributeNode(a.cloneNode() as Attr);
        }
        const frgm = this.processChildren(e);
        if(frgm) r.appendChild(frgm as DocumentFragment);
        return r;
      }
    }
  );
}

@qoop({AutoInit: {}, Trait: {}})
export class DOMTools{
  @InitTProp({makeDefault: makeManager}) declare manager : CNodeManager;
  @LazyInit() get trim(){ return makeDataRemover(this.manager.window); }

  constructor(_params: {manager:CNodeManager}){}

  async componentsToDSL(components: AbstractCNode[]):Promise<NodeSpecType>{
    return this.trimmedDomlibDSL((await Promise.all(components.map(c=>c.getWholeNodes()))).flat(1)); }

  trimmedDomlibDSL(nodes: Node[]): NodeSpecType{
    const man = this.manager;
    const trim = this.trim;
    const frgm = man.window.document.createDocumentFragment();
    for( const node of nodes ) frgm.appendChild(node.cloneNode(true));
    return asDomlibDSL( trim.process( frgm ) );
  }

  expectDOM(nodes: Node[]):Assertion<NodeSpecType>{
    return expect(this.trimmedDomlibDSL(nodes));
  }

  tools(){
    return {
      componentsToDSL: this.componentsToDSL.bind(this),
      trimmedDomlibDSL: this.trimmedDomlibDSL.bind(this),
      expectDOM: this.expectDOM.bind(this)
    }
  }
}
export const TCNodeDOMTools = makeMixer<Omit<DOMTools,'tools'>>(DOMTools);

export function makeDOMTools(man: CNodeManager){
  const dt = new DOMTools({manager: man});
  return dt.tools() }

export function makeExcpectDOM(man: CNodeManager){ return makeDOMTools(man).expectDOM; }
