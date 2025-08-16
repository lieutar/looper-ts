import * as nodePath from 'node:path';
import * as nodeCp   from 'node:child_process';
import * as nodeUrl  from 'node:url';
import * as nodeUtil from 'node:util';
import {isFile, rm, isDirectory, mkdir, readFile, writeFile, readDir, getStats} from '@looper-utils/fs';
import { packageDirectory } from 'pkg-dir';
import { sortPackageJson } from 'sort-package-json';
import type { LooperConfig } from './types';

const exec = nodeUtil.promisify(nodeCp.exec);

const rsc = await (async ()=>{
  const thisFile = nodeUrl.fileURLToPath(import.meta.url);
  const cwd      = nodePath.dirname(thisFile);
  const pkgDir   = await packageDirectory({cwd}) as string;
  return nodePath.join(pkgDir,  "rsc");
})();

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
  //if(!(await getStats(nodePath.join(dir, '.git')))) await exec('git init', { cwd: dir });

  if(!(await isFile(nodePath.join(dir, 'package.json')))){
    await exec('bun init -y', { cwd: dir });
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
}
