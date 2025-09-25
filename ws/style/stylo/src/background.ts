import { type StyloSheet } from './types';
import { combineFilter, type FilterFunctionsType } from './filter';


interface BackgroundLayerOptionsType {
  image?:      string;
  url?:        string;

  linearGradient?: string;
  radialGradient?: string;
  conicGradient?:  string;
  repeatingLinearGradient?: string;
  repeatingRadialGradient?: string;
  repeatingConicGradient?: string;

  repeat?:     string;
  position?:   string;
  size?:       string;
  origin?:     string;
  clip?:       string;
  attachment?: string;

  color?:      string;
};

type BgLayerOptionsType = BackgroundLayerOptionsType & Partial<FilterFunctionsType> & {filter?: string};

export const bg = (params: BgLayerOptionsType) => {
  const image = (params as any).image ?? (()=>{
    if(params.url) return `url("${params.url}")`;
    if(params.linearGradient ) return `linear-gradient(${params.linearGradient})`;
    if(params.radialGradient ) return `radial-gradient(${params.radialGradient})`;
    if(params.conicGradient  ) return `conic-gradient(${params.conicGradient})`;
    if(params.repeatingLinearGradient)return `repeating-linear-gradient(${params.repeatingLinearGradient})`;
    if(params.repeatingRadialGradient)return `repeating-radial-gradient(${params.repeatingRadialGradient})`;
    if(params.repeatingConicGradient) return `repeating-conic-gradient(${params.repeatingConicGradient})`;
    return null;
  })();
  if(!image) return {};
  return {
    repeat:     'no-repeat',
    position:   '0 0',
    size:       'auto',
    origin:     'padding-box',
    clip:       'border-box',
    attachment: 'scroll',
    ... params,  image}
};

export function combineBgFilters(layers:BgLayerOptionsType[]):string{
  let hasNone:boolean = false;
  const R = layers.map(l => {
    const combined = combineFilter(l);
    const precombined = l.filter;
    if(precombined){
      hasNone = !!precombined.match(/\bnone\b/);
      return precombined + " " + combined;
    }else{
      return combined;
    }
  });
  return hasNone ? 'none' : R.join(" ");
}

export const background = (... layers: BgLayerOptionsType[]): StyloSheet => {

  const prepared = layers.map(bg).filter(l => (l as any).image);

  const imgopt = (prop: string, defaultValue?: string)=>{
    return {
      ['background' + prop.replace(/^(.)/, s => s.toUpperCase())]: prepared.map(l=>{
        const v = (l as any)[prop]! ?? defaultValue;
        if(!v) return [];
        return [v];
      }).flat().join(", ")};
  };

  const color = layers.map(l => l.color ? {backgroundColor: l.color} : {})
    .reduce((a,v)=>({... v, ... a}), {});

  const filters = combineBgFilters(layers);
  const bFilter = filters.match(/\S/) ? {backdropFilter: filters} : {};

  return {
    ... imgopt('image'),
    ... imgopt('repeat',     'no-repeat'),
    ... imgopt('position',   '0 0'),
    ... imgopt('size',       'auto'),
    ... imgopt('origin',     'padding-box'),
    ... imgopt('clip',       'border-box'),
    ... imgopt('attachment', 'scroll'),
    ... color,
    ... bFilter
  } as StyloSheet;
};
