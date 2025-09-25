import {  newDocument,  type IWindow } from 'domlib';

import { pipe } from 'fp-ts/function';
import * as TE from 'fp-ts/TaskEither';
import { isFile, readFile } from 'looper-utils';
import { xmlifyMd } from './md';

type processMdParams =  {window: IWindow, file: string};
export function processMd(params: processMdParams): TE.TaskEither<Error, Document > {
  const window = params.window;
  return pipe(
    TE.tryCatch(
      async () => {
        const doc = window.document;
        const file = params.file
        if(!await isFile(file)) throw new Error(`'${file}' isn't a file.`);
        const content = (await readFile(file)).toString();
        const frgn = xmlifyMd(doc, content);
        const elem = doc.createElement('md-doc');
        elem.appendChild(frgn);
        return elem;
      },
      (reason) => new Error(`Failed to read or parse XML file: ${String(reason)}`)
    ),
    TE.map((e) => newDocument(window, e)),
  );
}
