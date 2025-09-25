//! exports "./ss"
import { Chalk, type ChalkInstance } from 'chalk';
import { Logger, type LogLevelType } from './index';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

export * from './index';

export function getChalk(): ChalkInstance{
  return process.env.INSIDE_EMACS ? new Chalk({level: 2}) : new Chalk();
}

export function getLoggerFromCommandLine(){
  const argv = yargs(hideBin(process.argv))
    .option('log-level', {
      alias: 'l',
      type: 'string',
      choices: ['silent', 'error', 'warn', 'info', 'debug'],
      default: 'info',
      description: 'Set the logging level (silent, error, warn, info, debug)',
    })
    .option('tag', {
      alias: 't',
      type: 'array',
      string: true,
      description: 'Filter logs by tags (can be specified multiple times)',
      default: [],
    })
    .option('with-trace', {
      type: 'boolean',
      default: false,
      description: 'Show full stack trace in debug logs',
    })
    .option('show-caller', {
      type: 'boolean',
      default: false,
      description: 'Show caller information in debug logs',
    })
    .help().alias('h', 'help') .argv as {
      'log-level'  : LogLevelType,
      'tag'        : string[],
      'show-caller': boolean,
      'with-trace' : boolean,
    };

  return new Logger({
    style:      getChalk(),
    level:      argv['log-level'],
    tags:       argv['tag'],
    showCaller: argv['show-caller'],
    withTrace:  argv['with-trace']
  })
}
