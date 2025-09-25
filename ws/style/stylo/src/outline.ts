import type { StyloSheet } from "./types";
import { divideNumUnit, unit } from "./utils";

function borderRadius(params: {radius?: string|number, padding?: string|number}): string{
  const radius = params.radius;
  if(!radius) return '';
  if('string' === typeof radius) return radius;
  const padding = (params.padding ? unit(params.padding, 'rem') : '1rem');
  return padding.replace(/^\s+|\s+$/,'').split(/\s/).map(divideNumUnit).map(
    ([num, unit]) => `${num * radius}${unit}`).join(" ");
}

export function outline(params: {
  style?:   string,
  width?:   string | number,
  color?:   string,
  border?:  string,
  margin?:  string | number,
  padding?: string | number,
  radius?:  string | number,
}):StyloSheet{
  return {
    ... (params.style   ? {borderStyle: params.style}            : {}),
    ... (params.width   ? {borderWidth: unit(params.width, 'px')}: {}),
    ... (params.color   ? {borderColor: params.color}            : {}),
    ... (params.border  ? {border: params.border}                : {}),
    ... (params.margin  ? {margin:  unit(params.margin, 'rem')}  : {}),
    ... (params.padding ? {padding: unit(params.padding, 'rem')} : {}),
    ... (params.radius  ? {borderRadius: borderRadius(params)}   : {})};
}
