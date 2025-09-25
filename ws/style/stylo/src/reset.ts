import type {  StyloSheet } from "./types";

export const boxReset = (): StyloSheet => ({
  margin: '0',
  padding: '0',
  boxSizing: 'border-box',
});

export const fontReset = (opt: {lineHeight?: string} = {}): StyloSheet => {
  const lineHeight = opt.lineHeight ?? '125%';
  return {
    lineHeight,
    fontStyle: 'normal',
  }};

export const HX = 'h1,h2,h3,h4,h5,h6';

export const globalRest = (opt: {fontSize?:string, lineHeight?:string} = {}): StyloSheet => {
  const fontSize = opt.fontSize ?? '16px';
  return {
    '*': {... boxReset(), ... fontReset(opt) },
    html: {
      fontSize, fontFamily: 'serif'
    },
    [HX]: {
      fontSize: '1rem',
      fontWeight: 900,
      fontFamily: 'sans-serif',
    },
    'ul, ol': {
      paddingLeft: '2em'
    },
    'article, aside, section, main, nav, footer, header':{ display: 'block'},
    'img, picture, video, canvas, svg': {
      display: 'block',
      maxWidth: '100%',
      height: 'auto',
    },
    'button, input, optgroup, select, textarea': {
      fontFamily: 'inherit',
      fontSize: '100%',
      lineHeight: '1.15',
      margin: '0',
    },
    'button, [type="button"], [type="reset"], [type="submit"]': {
      WebkitAppearance: 'button',
    },
  };
};
