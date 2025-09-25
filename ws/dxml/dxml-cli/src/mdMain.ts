import { commonArgs } from "./utils";
import { JSDOM } from 'jsdom';
import { pipe } from 'fp-ts/function';
import * as TE from 'fp-ts/TaskEither';
import * as  E from 'fp-ts/Either';
import { serializeDom } from "domlib";
import { processMd } from "dxml";


export async function mdMain(){
  const argv = await commonArgs().check((argv:any) => {
    if (!argv.output && !argv.stylesheet) {
      const file = (argv._ as any)[0];
      if(!file) throw new Error(`File Argument is required.`);
    }
    return true;
  }).help().argv;

  const window = new JSDOM().window;
  const rs = await pipe(
    processMd({ file: (argv._ as any)[0]! as string, window }),
    TE.map(serializeDom.bind(null, window)))();
  if(E.isLeft(rs)) throw rs.left;
  console.log(rs.right);
}
