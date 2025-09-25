import type { StyloSheet } from "./types";

function _display(displayValue:string, styles: StyloSheet): StyloSheet{
  const display = `${styles.display ?? ''} ${displayValue}`;
  return { ... styles, display };
}
export function none     (styles: StyloSheet={}):StyloSheet{ return _display('none',     styles);}
export function block    (styles: StyloSheet={}):StyloSheet{ return _display('block',    styles);}
export function inline   (styles: StyloSheet={}):StyloSheet{ return _display('inline',   styles);}
export function runIn    (styles: StyloSheet={}):StyloSheet{ return _display('run-in',   styles);}
export function listItem (styles: StyloSheet={}):StyloSheet{ return _display('list-item',styles);}
export function contents (styles: StyloSheet={}):StyloSheet{ return _display('contents', styles);}

/// table
export function table            (styles: StyloSheet={}):StyloSheet{ return _display('table',             styles);}
export function tableCaption     (styles: StyloSheet={}):StyloSheet{ return _display('table-caption',     styles);}
export function tableHeaderGroup (styles: StyloSheet={}):StyloSheet{ return _display('table-header-group',styles);}
export function tableRowGroup    (styles: StyloSheet={}):StyloSheet{ return _display('table-row-group',   styles);}
export function tableFooterGroup (styles: StyloSheet={}):StyloSheet{ return _display('table-footer-group',styles);}
export function tableRow         (styles: StyloSheet={}):StyloSheet{ return _display('table-row',         styles);}
export function tableCell        (styles: StyloSheet={}):StyloSheet{ return _display('table-cell',        styles);}
export function tableColumnGroup (styles: StyloSheet={}):StyloSheet{ return _display('table-column-group',styles);}
export function tableColumn      (styles: StyloSheet={}):StyloSheet{ return _display('table-column',      styles);}

/// ruby
export function ruby             (styles: StyloSheet={}):StyloSheet{ return _display('ruby',               styles);}
export function rubyBase         (styles: StyloSheet={}):StyloSheet{ return _display('ruby-base',          styles);}
export function rubyText         (styles: StyloSheet={}):StyloSheet{ return _display('ruby-text',          styles);}
export function rubyBaseContainer(styles: StyloSheet={}):StyloSheet{ return _display('ruby-base-container',styles);}
export function rubyTextContainer(styles: StyloSheet={}):StyloSheet{ return _display('ruby-text-container',styles);}

export function flow    (styles: StyloSheet={}):StyloSheet{ return _display('flow',     styles);}
export function flowRoot(styles: StyloSheet={}):StyloSheet{ return _display('flow-root',styles);}
export function flex    (styles: StyloSheet={}):StyloSheet{ return _display('flex',     styles);}
export function grid    (styles: StyloSheet={}):StyloSheet{ return _display('grid',     styles);}


/// Precomposed Inline-level Display Values
// https://www.w3.org/TR/css-display-3/#legacy-display

// inline-block    Computes to inline flow-root.
export function inlineBlock(styles: StyloSheet={}):StyloSheet{ return _display('inline flow-root', styles); }
// inline-table    Computes to inline table.
export function inlineTable(styles: StyloSheet={}):StyloSheet{ return _display('inline table', styles); }
// inline-flex     Computes to inline flex.
export function inlineFlex(styles: StyloSheet={}):StyloSheet{ return _display('inline flex', styles); }
// inline-grid   Computes to inline grid.
export function inlineGrid(styles: StyloSheet={}):StyloSheet{ return _display('inline grid', styles); }

/*
// 拡張版 flex 関数
export function flex(
  styles: Styles = {},
  options?: {
    direction?: 'row' | 'row-reverse' | 'column' | 'column-reverse';
    justify?: 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around' | 'space-evenly';
    align?: 'flex-start' | 'flex-end' | 'center' | 'stretch' | 'baseline';
    wrap?: 'nowrap' | 'wrap' | 'wrap-reverse';
    gap?: string | number; // `rem` 変換ヘルパーを再利用
    // `align-content` なども必要に応じて追加
  }
): Styles {
  const flexStyles = {
    ...styles, // 既存スタイルとdisplay: flex を結合
    ..._display('flex', {}), // display: 'flex' を適用

    ...(options?.direction ? { flexDirection: options.direction } : {}),
    ...(options?.justify ? { justifyContent: options.justify } : {}),
    ...(options?.align ? { alignItems: options.align } : {}),
    ...(options?.wrap ? { flexWrap: options.wrap } : {}),
    ...(options?.gap !== undefined ? { gap: typeof options.gap === 'number' ? `${options.gap}rem` : options.gap } : {}),
  };
  return flexStyles;
}

// 使用例:
// const flexContainer = flex({ height: '100px' }, {
//   direction: 'column',
//   justify: 'center',
//   align: 'center',
//   gap: 1.5, // 1.5rem
// });
 */


/*
// 拡張版 grid 関数
export function grid(
  styles: Styles = {},
  options?: {
    templateColumns?: string;
    templateRows?: string;
    gap?: string | number; // `rem` 変換ヘルパーを再利用
    autoColumns?: string;
    autoRows?: string;
    autoFlow?: 'row' | 'column' | 'row dense' | 'column dense';
    // `justify-items`, `align-items`, `justify-content`, `align-content` なども必要に応じて追加
  }
): Styles {
  const gridStyles = {
    ...styles, // 既存スタイルとdisplay: grid を結合
    ..._display('grid', {}), // display: 'grid' を適用

    ...(options?.templateColumns ? { gridTemplateColumns: options.templateColumns } : {}),
    ...(options?.templateRows ? { gridTemplateRows: options.templateRows } : {}),
    ...(options?.gap !== undefined ? { gap: typeof options.gap === 'number' ? `${options.gap}rem` : options.gap } : {}),
    ...(options?.autoColumns ? { gridAutoColumns: options.autoColumns } : {}),
    ...(options?.autoRows ? { gridAutoRows: options.autoRows } : {}),
    ...(options?.autoFlow ? { gridAutoFlow: options.autoFlow } : {}),
  };
  return gridStyles;
}

// 使用例:
// const gridContainer = grid({ padding: 1 }, {
//   templateColumns: '1fr 2fr 1fr',
//   gap: 0.5, // 0.5rem
//   autoRows: 'minmax(100px, auto)'
// }); */
