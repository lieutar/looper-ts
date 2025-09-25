import yargs from "yargs";
import { hideBin } from "yargs/helpers";

export function commonArgs(){
  return yargs(hideBin(process.argv))
    .option('output', {
      alias: 'o',
      type: 'string',
      description: 'Output file path',
    })
    .option('pp', {
      alias: 'p',
      type: 'string',
      description: `Preprocessor.`
    })
    .option('style', {
      alias: 's',
      type: 'string',
      description: `Specify output style.
      Builtin styles:
        md: for Markdown
      `,
    })
    .option('lang', {
      type: 'string',
      choices: ['en', 'ja'],
      default: 'en',
      description: 'Target language for trimming/processing',
    })
    .positional('srcFile', {
      type: 'string',
      demandOption: true,
      description: 'Source XML file path',
    });
}
