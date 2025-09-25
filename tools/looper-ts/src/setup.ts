import * as nodePath from 'node:path';
import {isFile, rm, isDirectory, mkdir, readFile, writeFile, readDir} from 'looper-utils';
import { sortPackageJson } from 'sort-package-json';
import type { LooperConfig } from './types';
import { getRscDir, runCommand } from './utils';
//import { setupRepos } from './repos-utils';


const rsc = await getRscDir();

async function setupPackageJson(dir: string, cfg: LooperConfig){
  const packageJsonPath = nodePath.join(dir, 'package.json');
  if(!isFile(packageJsonPath)) throw new Error();
  const packageJson = JSON.parse( (await readFile(packageJsonPath)).toString() );
  if(packageJson.main    ) delete packageJson.main;
  if(packageJson.module  ) delete packageJson.module;
  if(!packageJson.exports){
    packageJson.exports = { ".": { import: "./src/index.ts" } };
  }else{
    // error check if necessary
  }

  packageJson.scripts = {
    ... (packageJson.scripts || {}),
    clean: "rm -r dist",
    build: "tsc -p tsconfig.build.json",
    'coverage:bun': "bun test --coverage",
    check: 'bun run lint && bun run typecheck',
    typecheck: "tsc -p tsconfig.build.json --noEmit",
    'test': "vitest",
    'coverage': 'vitest: --coverage',
    lint: "eslint . --ext .ts,.tsx,.js,.jsx",
    "lint:fix": "eslint . --ext .ts,.tsx,.js,.jsx --fix",
  };

  packageJson.devDependencies = {
    ... (packageJson.devDependencies || {}),
    "looper-ts": "*",
    vitest: 'latest',
    "vitest-tsconfig-paths": "latest",
    "@vitest/coverage-v8": 'latest',
    depcheck: 'latest',
    eslint: "latest",
    "eslint-config-prettier": "latest",
    "eslint-plugin-prettier": "latest",
  };

  cfg.packageJson(packageJson);

  await writeFile(packageJsonPath, JSON.stringify( sortPackageJson( packageJson ), null, 2));
}

async function copyResources(dir: string){
  for(const dirent of await readDir(rsc)){
    const {name} = dirent;
    const src = nodePath.join(rsc, name);
    const dst = nodePath.join(dir, name);
    if(dirent.isDirectory()){
    }else{
      const content = await readFile(src);
      await writeFile( dst, content );
    }
  }
}

async function getConfig(dir: string):Promise<LooperConfig>{
  const looperConfigTs = nodePath.join(dir, 'looper.config.ts');
  return {
    packageJson(_){},
    ... await (async()=>{
      if(!(await isFile(looperConfigTs))) return {};
      return (await import( looperConfigTs ) as any).default || {};
    })()};
}

export async function setup(dir:string){
  console.log('-'.repeat(80)+"\n"+`setup '${dir}'...\n`);

  if(!(await isFile(nodePath.join(dir, 'package.json')))){
    await runCommand('bun', ['init', '-y'], { cwd: dir });
    const indexTs = nodePath.join(dir, 'index.ts');
    if(await isFile(indexTs)) await rm(indexTs);
  }

  const src = nodePath.join(dir, 'src');
  if(!(await isDirectory(src))){
    await mkdir(src);
  }

  const cfg = await getConfig(dir);
  await setupPackageJson(dir, cfg);
  await copyResources(dir);

  /*
  if(dir.match(/\/ws\/[^\/]+\/[^\/]+$/)){
    await setupRepos(dir);
  }else{
    console.log(`This project '${dir}' is a part of looper-ts... Skip.`);
  }
   */
}
