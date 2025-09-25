#! /usr/bin/env bun
import { setup } from "./setup";
import { list  } from './list';
import yargs  from 'yargs';
import { hideBin } from 'yargs/helpers';
import { sync } from "./sync";
import { doc } from "./doc";

const argv = yargs(hideBin(process.argv))
  .strict()
  .usage  (`Usage: looper-ts [options]` )
  .help   (       ).alias('h', 'help'   )
  .version('0.0.1').alias('v', 'version')
  .command('list',  'List managed projects', yargs => yargs
    .option('absolute', {
      alias: 'a',
      type: 'boolean',
      default: false
    })
    .option('no-stat', {
      'alias': 'n',
      type: 'boolean',
      default: false
    })
    .option('repos', {
      'alias': 'r',
      type: 'boolean',
      default: false
    }))
  .command('sync',  'Update all managed projects by new settings')
  .command('setup', 'Setup a project')
  .command('doc',   'Build READMEs from README.dxml')
  .argv;

switch((argv as any)._[0]){
  case 'list':
    await list(argv as any);
    break;
  case 'sync':
    await sync();
    break;
  case 'setup':
    await setup(process.cwd());
    break;
  case 'doc':
    await doc(process.cwd());
    break;
}
