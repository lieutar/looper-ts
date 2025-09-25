import { JSDOM } from 'jsdom';
import * as nodePath from 'node:path';
import { isFile, writeFile } from "looper-utils";
import { processDxml } from 'dxml';
import { E } from 'looper-utils';

export async function doc(dir:string){
  const dxml = nodePath.join(dir, 'README.dxml');
  const cwd  = process.cwd();
  if(!await isFile(dxml)){
    console.log(nodePath.relative(cwd, dxml),` is not exists. Skip`);
    return;
  }
  const params = {
    file: dxml,
    pp: 'looper-ts:github',
    style: 'md',
    window: new JSDOM().window
  };
  const en = await processDxml({... params, lang:'en', asText: true})();
  const ja = await processDxml({... params, lang:'ja', asText: true})();
  if(E.isLeft(en)) throw E.left;
  if(E.isLeft(ja)) throw E.left;
  const enmd = nodePath.join(dir, 'README.md');
  const jamd = nodePath.join(dir, 'README.ja.md');
  console.log(`writing '${nodePath.relative(cwd, enmd)}'...`);
  writeFile(enmd, Buffer.from(en.right));
  console.log('done');
  console.log(`writing '${nodePath.relative(cwd, jamd)}'...`);
  writeFile(jamd, Buffer.from(ja.right));
  console.log('done');
}
