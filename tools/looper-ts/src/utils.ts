import * as nodeCP   from 'node:child_process';
import * as nodeUrl  from 'node:url';
import * as nodePath from 'node:path';
import { packageDirectory } from 'pkg-dir';
import { readDir } from 'looper-utils';

let looperTsToolDir: string|null = null;
export async function getLooperTsToolDir(){
  if(!looperTsToolDir){
    const thisFile = nodeUrl.fileURLToPath(import.meta.url);
    const cwd      = nodePath.dirname(thisFile);
    looperTsToolDir = await packageDirectory({cwd}) as string;
  }
  return looperTsToolDir;
}

let rscDir: string|null = null;
export async function getRscDir(){
  if(!rscDir){
    rscDir =  nodePath.join(await getLooperTsToolDir(),  "rsc");
  }
  return rscDir;
}

let wsDir: string|null = null;
export async function getWsDir(){
  if(!wsDir){
    const toolDir = await getLooperTsToolDir();
    wsDir = await packageDirectory({cwd: nodePath.dirname(toolDir)}) as string;
  }
  return wsDir;
}

let allProjects: string[]|null = null;
export async function getAllProjects(){
  if(!allProjects){
    const wsdir = await getWsDir();
    const wsDirs = await Promise.all([
      nodePath.join(wsdir, 'tools'),
      ... [... await readDir(nodePath.join(wsdir, 'ws'))].map((e:any)=>nodePath.join(wsdir, 'ws', e.name))
    ].map(async (dir)=>{
      return [... await readDir(dir)].map((e:any)=>nodePath.join(dir, e.name))
    }));
    allProjects = wsDirs.flat();
  }
  return allProjects;
}

export async function projectToGhRepos(project:string):Promise<string|null>{
  const local = nodePath.relative(await getWsDir(), project);
  if(local.match(/^tools\b/)) return null;
  return local.replace(/^ws\b/, 'ts').replace(/\//g, '--');
}

export interface runCommandResult {
status: number|null;
stdout: string;
stderr: string;
}
export interface runCommandOpt {
echoOff?: boolean;
noError?: boolean;
[key:string]: any;
}
export async function runCommand(cmd:string, args:string[] = [], opt:runCommandOpt = {}):Promise<runCommandResult>{
  return new Promise((cont)=>{
    if(!opt.echoOff) console.log('runCommand:', cmd, ... args);
    const proc = nodeCP.spawn(cmd, args, opt as any);
    const stdout:string[] = [];
    const stderr:string[] = [];
    proc.stdout.on('data', data => {
      stdout.push(String(data));
      if(!opt.echoOff) process.stdout.write(data);
    });
    proc.stderr.on('data', data => {
      stderr.push(String(data));
      if(!opt.echoOff) process.stderr.write(data);
    });
    proc.on('exit', (status)=>{
      if(status !== 0 && !opt.noError)
        throw new Error(`Process was failed: (exit code ${status})`);
      cont({
        status,
        stdout: stdout.join(''),
        stderr: stderr.join('')
      }); });
  });
}
