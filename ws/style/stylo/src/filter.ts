export interface FilterFunctionsType {
blur:       string | number;
brightness: string | number;
contrast:   string | number;
dropShadow: string;
grayscale:  string | number;
hueRotate:  string | number;
invert:     string | number;
opacity:    string | number;
sepia:      string | number;
saturate:   string | number;
}

export const FILTER_FUNCTIONS = {
  blur:       'blur',
  brightness: 'brightness',
  contrast:   'contrast',
  dropShadow: 'drop-shadow',
  grayscale:  'grayscale',
  hueRotate:  'hue-rotate',
  invert:     'invert',
  opacigy:    'opacity',
  sepia:      'sepia',
  saturate:   'saturate'
};

export type FilterParams = Partial<FilterFunctionsType> & {filter?: string};

export function combineFilter(params: FilterParams): string{

  const prop = (field: keyof FilterFunctionsType, unitName:string = '%')=>{
    if(!params[field]) return [];
    const func = (FILTER_FUNCTIONS as any)[field]!;
    if('number' === typeof params[field]){
      if(unitName === '%') return [`${func}(${params[field] * 100}%)`];
      return [`${func}(${params[field]}${unitName})`]
    }
    return [ `${func}(${params[field]})`];};

  return [
    ... prop('blur', 'px'), ... prop('brightness'), ... prop('contrast'),
    ... prop('dropShadow'), ... prop('grayscale'),  ... prop('hueRotate'),
    ... prop('invert'),     ... prop('opacity'),    ... prop('sepia'),
    ... prop('saturate'),
    ... (params.filter ? [params.filter] : [])
  ].join(" "); }

export function combineSomeFilters(args:  FilterParams[]): string{
  return args.map(combineFilter).join(" "); }

export function filter(... args:  FilterParams[]){
  return { filter: combineSomeFilters(args) }; }
