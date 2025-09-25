import * as bases from 'bases';

export function quotemeta( str: string ){
  return str.replace(/([\[\]\(\)\|\.\*\+\{\}\\])/g, s => `\\${s}`); }

export function rndstr( length: number = 8, tbl:string = bases.KNOWN_ALPHABETS[62] as string ){
  let R = "";
  while(R.length < length) R += bases.toAlphabet(Math.round(Math.random() * 1000000000000000), tbl);
  return R.slice(0, length); }

export const gensym = (()=>{
  let prefix: string | null = null;
  let counter =  0;
  return function(){
    if(prefix === null) prefix = rndstr() + '-' + bases.toBase(Date.now(), 62) + "-";
    return prefix + String(counter++); }
})();
