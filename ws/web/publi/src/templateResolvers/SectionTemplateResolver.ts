import { cssLinks, iconLinks } from "domlib";
import { articleFilter, Section } from "../components";
import type { AbstractCNode, CNodeDSLEnvType, CNodeTemplateBuilderType, GenericCNode } from "cnode";

export type GenericSectionTemplateBuilderType =
 (env:{depth:number}) => (env:CNodeDSLEnvType) => GenericCNode;

export type SpecialSectionTemplateBuilderDictType =
  {[depth:number]:CNodeTemplateBuilderType};

export interface SectionTemplateResolverProps{
  special: SpecialSectionTemplateBuilderDictType;
  generic: GenericSectionTemplateBuilderType;
};

const genericTemplate = (geta:number):GenericSectionTemplateBuilderType=>(({depth})=>({c,$$})=>c(['section',
  ['header',
    (depth + geta < 7 ? [`h${depth+geta}`, $$('title')] : ['p', {class: `heading heading-${depth+geta}`}, $$('title')]),
    ['div', {class: 'info'}, $$('header')],
    ['nav', $$('headNav') ]],
  ['article', $$({name: 'article', filter: articleFilter})],
  ['footer',
    ['nav', $$('footNav')],
    ['div', {class: 'info'}, $$('footer') ] ]]));

export class SectionTemplateResolver {

  private _special : SpecialSectionTemplateBuilderDictType = {
    0: ({c, $, $$})=>c(['html', {'lang': 'en'},
      ['head',
        $('title', {tagName: 'title', defaultValue: 'page title'}),
        ... cssLinks('./rsc/css/index.css'),
        ... iconLinks('./rsc/img/favicon.svg', './favicon.ico')
      ],
      ['body',
        ['header',
          ['h1',  $$('title') ],
          ['div', {class: 'info'}, $$('header')],
          ['nav', $$('headNav')]
        ],
        ['main', ['article', $$('article')]],
        ['footer',
          ['nav', $$('footNav')],
          ['div', {class: 'info'}, $$('footer')]]]])
  };

  private _generic : GenericSectionTemplateBuilderType = genericTemplate(1);

  constructor(params: Partial<SectionTemplateResolverProps> = {}){
    if(params.special) this._special = params.special;
    if(params.generic) this._generic = params.generic;
  }

  static vanilla():SectionTemplateResolver{
    return new SectionTemplateResolver({
      special: {},
      generic: genericTemplate(2)
    });
  }

  setSpecial(depth:number, builder: CNodeTemplateBuilderType):void{ this._special[depth] = builder; }
  deleteSpecial(depth:number):void{ delete this._special[depth]; }

  setGeneric(generic: GenericSectionTemplateBuilderType){ this._generic = generic; }
  resolveGeneric(section: Section) : CNodeTemplateBuilderType{ return this._generic({depth: section.depth}); }

  resolve (section: AbstractCNode){
    if(!(section instanceof Section)) throw new Error();
    const depth = section.depth;
    const special = this._special[depth];
    if(special) return special;
    return this.resolveGeneric(section);
  }
}
