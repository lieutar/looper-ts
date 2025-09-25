import { PubliBuilder, PubliBuilderContext, Section } from "publi";
import { processDxml } from "dxml";
import { pipe } from 'fp-ts/function';
import * as TE from 'fp-ts/TaskEither';
import * as  E from 'fp-ts/Either';
import { isTextNode, queryElement } from "domlib";
import { type CNodeFragmentBuilderType } from "cnode";
import { DOMProcessor } from "dom-processor";

export class DxmlBuilder extends PubliBuilder{

  override async buildPubliResponse(ctx: PubliBuilderContext): Promise<void> {
    const rs = await pipe(
      processDxml({file: this.file, lang: 'en', window: ctx.manager.window, asText: false }),
      TE.map((doc) => {
        const title = queryElement({from: doc, path: ['sec', 'title'], ignoreCase: true})?.textContent || 'undefined';
        const {sec} = ctx.componentBuildersEnv;
        const components:CNodeFragmentBuilderType = ({F})=>{

          const dp = new DOMProcessor<any>({output: (o:unknown[])=>o.filter(e=>e!==null)});
          const simple = (element:string, tagName:string)=>({ element,
            action(this:DOMProcessor, n:Node){
              const e = n as Element;
              return [tagName, ... this.processChildren(e) as any[]]; } });

          dp.rule(
            { element: 'sec',
              action(n){
                const e = n as Element;
                const titleNode = queryElement({from: e, path:['title'], ignoreCase: true});
                if(!titleNode) throw new Error();
                const tf = this.processChildren(titleNode);
                const af = this.processSiblings(titleNode.nextSibling);
                const title   = F(... tf as any[]);
                const article = F(... af as any[]);
                return sec({ title, article });
              }
            },
            simple('paragraph','p'),
            { element: 'list',
              action(n){
                const e = n as Element;
                const R = [(e.getAttribute('ordered') === 'true' ? 'ol' : 'ul'),
                  ... this.processChildren(e) as any[]];
                return R;
              },
            },
            simple('listItem','li'),
            simple('inlineCode','code'),
            { element: 'code',
              action(n){
                const e = n as Element;
                return ['pre', {class: `lang-${e.getAttribute('lang')}`},
                  ... this.processChildren(e) as any[] ]
              },
            },
            { element: '*',
              action(n){
                const e = n as Element;
                return ['div', {class: 'dxml-error', 'data-original-tag-name': e.tagName},
                  ... this.processChildren(e) as any[] ]
              },
            },
            { when: isTextNode,
              action(n){
                const text = n.textContent || '';
                return (text.match(/^\s*$/)) ? null : text; } });

          const root = dp.process(doc) as Section;
          return root.article;
        }; // end of components =

        return { title, components };
      }))();
    if(E.isLeft(rs)) throw rs.left;
    await ctx.writeContents(rs.right as any);
  }
}
