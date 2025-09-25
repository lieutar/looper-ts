import { JSDOM } from 'jsdom';
import { commonArgs } from './utils';
import { processDxml, type LangType } from 'dxml';
import { E, writeFile } from 'looper-utils';

export async function dxmlMain(){

  const argv = await commonArgs().check((_argv:any) => {
      return true;
  }).help().argv;

  const rs = await processDxml({
    asText: true,
    file: (argv._ as any)[0],
    lang: argv.lang as LangType,
    pp:    (argv as any).pp,
    style: (argv as any).style,
    window: new JSDOM().window })();

  if(E.isLeft(rs)) throw rs.left;

  const of = (argv as any).output;
  if(of){
    writeFile(of, rs.right);
  }else{
    console.log(rs.right);
  }
}
