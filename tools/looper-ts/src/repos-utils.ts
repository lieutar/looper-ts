import * as nodePath from 'node:path';
import { getStats, rmdir } from "looper-utils";
import { projectToGhRepos, runCommand } from "./utils";

export async function isReposClean(dir:string):Promise<boolean>{
  const {stdout} = await runCommand('git', ['status'],
    { cwd: dir, env: {LANG:'C'}, echoOff: true, noError: true });
  if(stdout.match(/\bnothing to commit, working tree clean/)) return false;
  return true;
}

export async function hasUnpushedChange(dir:string):Promise<boolean>{
  const {stdout} = await runCommand('git', ['log', 'origin/main..main'],
    { cwd: dir, env: {LANG: 'C'}, echoOff: true, noError: true});
  return !!(stdout.match(/[^\s]/));
}

export async function isReposExists(repos:string){
  console.log(`Checking '${repos}' is being ...`);
  const {status} = await runCommand('gh', ['repo', 'view', repos], {echoOff: true, noError: true});
  if(status === 0){
    console.log('Found!');
    return true;
  }else{
    console.log('Not Found');
    return false;
  }
}

export async function makeGhRepos(repos:string, source: string){
  await runCommand('gh', [
    'repo', 'create', repos,
    '--source', source,
    '--public',
    '--push'
  ]);
}

export async function makeAsSubmodule(dir:string){
  const repos = await projectToGhRepos(dir);
  if(!repos) throw new Error();
  if(!(await isReposExists(repos))){  await makeGhRepos(repos, dir); }
  console.log(`Removing directory '${dir}'`);
  await rmdir(dir, {recursive: true});
  await runCommand('git',
    ['submodule', 'add', `git@github.com:lieutar/${repos}`, nodePath.basename(dir)],
    {cwd: nodePath.dirname(dir)});
}

export async function setupRepos(dir:string){
  const gitfile = nodePath.join(dir, '.git');
  const stat = await getStats(gitfile);
  if(stat){
    if(stat.isFile()) return;
    if(await isReposClean(dir)){
      await runCommand('git', ['add', '.'], {cwd: dir});
      await runCommand('git', ['commit', '-m', 'commit for making as submodule.'], {cwd: dir});
    }
  }else{
    await runCommand('git', ['init'], {cwd: dir});
    await runCommand('git', ['add', '.'], {cwd: dir});
    await runCommand('git', ['commit', '-m', 'initial commit.'], {cwd: dir});
  }
  await makeAsSubmodule(dir);
}
