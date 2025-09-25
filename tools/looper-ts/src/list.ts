import * as nodePath from 'node:path';
import { getAllProjects, projectToGhRepos  } from './utils';


async function listRepos(projects:string[]){
  for(const p of projects){
    console.log(await projectToGhRepos(p));
  }
}


export async function list(opt: {absolute?:boolean, 'no-stat'?:boolean, repos?: boolean} = {}){
  const projects = await getAllProjects();
  if(opt.repos) return await listRepos(projects);
  const cwd = process.cwd();
  console.log(projects.map(p => opt.absolute ? p : nodePath.relative(cwd, p)).join("\n"));
  if(!opt['no-stat']) console.log("----\n", projects.length, 'projects');
}
