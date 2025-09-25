import { cssLinks, iconLinks } from 'domlib';
import { type PubliChainContext, ContentsContext, PubliAction, TemplateLayout } from 'publi';

export default class extends PubliAction{

  override async publiAction(ctx: PubliChainContext){

    ctx.defineLayout({layout: (commonProps)=>new TemplateLayout({ ... commonProps,
      template: ({c,$,$$})=>c(['html', {lang: 'en'},
        ['head',
          ['meta', {charset: 'utf-8'}],
          $('pageTitle',{ tagName: 'title'}),
          ... cssLinks('./rsc/css/index.css'),
          ... iconLinks('./rsc/img/favicon.svg', './favicon.ico')
        ],
        ['body',
          ['header', {id: 'main-header'},
            ['nav',
              ['p', {id:'bread-crumbs'}, $$('breadCrumbs')]],
            $('contentsTitle', { tagName: 'h1'}),
          ],
          ['nav', {id: 'main-nav'},  $$('contentsNav')],
          ['main', {id: 'main-contents'},
            ['article', $$('contentsArticle')]],
          ['aside', {id: 'main-aside'}, $$('contentsAside')],
          ['footer', {id: 'main-footer'},
            $$('footer'),
            ['nav', $$('footNav')]]
        ],
      ]),

      // eslint-disable-next-line @typescript-eslint/require-await
      values: async (cc: ContentsContext) => (key: string) => {
        if(key === 'pageTitle') return cc.contents.title + (cc.parts[0] ? " - " + cc.parts[0].title : "");
        if(key === `contentsTitle`) return cc.contents.title;
        return null;
      },

      components: (cc: ContentsContext) => {
        return  async (key: string) => {
          switch(key){
            case 'contentsArticle': return cc.forceContentsComponents();
            case 'breadCrumbs':
              return cc.createSome(({c,F}) => F(... cc.parts.map(p=>c(['a', {href:p.requestPath}, p.title]))));
            case 'footer': return cc.partComponents(0,'footer');
          }
          return null;
        }}})});
    //*/

    await ctx.addPart({
      title: 'lieutar looper',
      action: this,
      components: ({F})=>({
        footer: F(
          ['address',
            ['a', { href:"https://toot.blue/@lieutar", target: "_blank" },
              '@lieutar@toot.blue']] )
      })
    });

  }
}
