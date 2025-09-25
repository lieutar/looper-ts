import type { StyloSheet } from "./types";

export function text(params: {
  align?: string,
  family?: string,
  style?: string,
  color?: string,
  decoration?: string,
  size?: string | number,
  weight?: string | number,
  shadow?: string
}):StyloSheet{
  return {
    ... (params.align  ? {textAlign: params.align} : {}),
    ... (params.family ? {fontFamily: params.family} : {}),
    ... (params.style  ? {fontStyle: params.style} : {}),
    ... (params.color  ? {color: params.color} : {}),
    ... (params.decoration ? {textDecoration: params.decoration} : {}),
    ... (params.size ? {fontSize: ('number' === typeof params.size ? `${params.size}rem` : params.size)} : {}),
    ... (params.weight ? {fontWeight: String(params.weight)} : {}),
    ... (params.shadow ? {textShadow: params.shadow} : {})
  };
}
