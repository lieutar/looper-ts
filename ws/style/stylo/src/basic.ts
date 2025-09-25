import { text } from "./text";
import { background } from "./background";
import { block, inlineBlock, listItem } from "./display";
import { outline } from "./outline";
import { globalRest } from "./reset";
import { Eero } from "eero";

export const basicStyles = (params: {
  lineHeight?: string,
  color?: string | Eero,
} = {lineHeight:'150%'})=>{
  const textColor = Eero.from((params.color ?? '#000E') as any);
  return {
    ... globalRest(params),

    html: block({
      ... background({
        image: 'linear-gradient(to top, #F0F0F0FF, #FFF0)',
        size: '100% 100%',
      }),
      color: textColor.toString()
    }),

    a: { textDecoration: 'none', },
    'a:hover' : { textDecoration: 'underline', },
    'a:visited' : {  color: '#939' },

    code: inlineBlock({
      background: textColor.mod(c=>{c.b += 0.2; c.alpha = 0.1}).toString(),
      ... outline({
        padding: '0px 0.5em',
        radius: '8px',
      }),
      ... text({
        family: 'monospaced',
        size: '.8rem',
        shadow: 'none',
        color: textColor.mod(c=>{c.b += 0.2; c.alpha = 0.75}).toString()
      }),
    }),

    li: listItem({
      marginBottom: '.5rem',
      '&:last-item' : {
        marginBottom: '0'
      }
    }),
}};
