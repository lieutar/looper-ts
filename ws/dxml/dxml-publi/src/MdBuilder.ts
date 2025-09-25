import { PubliBuilder, PubliBuilderContext } from "publi";
import { processMd } from "dxml";
import { pipe } from 'fp-ts/function';
import * as TE from 'fp-ts/TaskEither';
import * as  E from 'fp-ts/Either';
import { isElementNode, isTextNode } from "domlib";
import type { Nullable } from "looper-utils";
import { type CNodeFragmentBuilderType, type CNodeNodeSpecType } from "cnode";

export class DxmlBuilder extends PubliBuilder{

  async buildPubliResponse(ctx: PubliBuilderContext): Promise<void> {
    const rs = await pipe(
      processMd({file: this.file, window: ctx.manager.window}),
      TE.map((doc) => {

        const evaluate = (node:Node, xpath: string) => {
          const rs = doc.evaluate(xpath, node, null,
            ctx.manager.window.XPathResult.FIRST_ORDERED_NODE_TYPE, null);
          if(!rs.singleNodeValue) throw new Error();
          return rs.singleNodeValue; };

        const title = evaluate(doc, "/sec/title").textContent as string;
        //const {sec} = ctx.componentBuildersEnv;
        const components:CNodeFragmentBuilderType = (_)=>{

            const processNode    = (n: Node) => {
              if(isElementNode(n)) return [processElement(n)];
              if(isTextNode(n)){
                const data = String( n.textContent ?? '' );
                if(data.match(/^\s*$/)) return [];
                return [data];
              }
              return [];
            };

            const processFragment = (n: Nullable<Node>):CNodeNodeSpecType[] => {
              const loop = (n: Nullable<Node>, buf : any[])=>{
                if(!n) return buf;
                const newBuf = (()=>{
                  const result = processNode(n);
                  if(!(Array.isArray(result[0]) &&
                    ((result[0][0] === 'ul' || result[0][0] === 'ol') && buf.length > 0 &&
                      result[0][0] === buf[buf.length-1][0]))) return [... buf, ... result];
                  const last = buf.pop();
                  const [_, ... body] = result[0];
                  return [... buf, [... last, ... body]]; })();
                return loop(n.nextSibling, newBuf);
              };
              return loop(n, []);
            };

            const processElement = (e: Element) => {
              const rules = {
                /*
                sec: ()=>{
                  const titleNode = evaluate(e, './title');
                  const tf = processFragment(titleNode.firstChild);
                  const af = processFragment(titleNode.nextSibling);
                  const title   = F(... tf);
                  const article = F(... af);
                  return sec({ title, article });
                },
                 */
                heading: ()=>{
                  const depth = parseInt( e.getAttribute('depth') || '5' ) + 1;
                  const head = depth <= 6 ? [`h${depth}`,{}] : ['p', {class: 'heading'}];
                  return [... head, ... processFragment(e.firstChild)] },

                paragraph: ()=>{ return ['p', ... processFragment(e.firstChild)] },

                list: () => {
                  const R = [(e.getAttribute('ordered') === 'true' ? 'ol' : 'ul'),
                    ... processFragment(e.firstChild)];
                  return R;
                },

                listItem:   () => { return ['li',   ... processFragment(e.firstChild) ] },
                inlineCode: () => { return ['code', ... processFragment(e.firstChild) ] },
                code: () => { return ['pre', {class: `lang-${e.getAttribute('lang')}`},
                  ... processFragment(e.firstChild) ] },
              } as {[key:string]: ()=>any};
              const fallback =  () => {
                return ['div', {class: 'dxml-error', 'data-original-tag-name': e.tagName},
                  ... processFragment(e.firstChild)];
              };
              return (rules[e.tagName] ?? fallback)();
            };

          const root = processElement(doc.documentElement);
          return root.article;
        }; // end of components =

        return { title, components };
      }))();
    if(E.isLeft(rs)) throw rs.left;
    await ctx.writeContents(rs.right as any);
  }
}
