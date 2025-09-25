import { setup } from "./setup";
import { getAllProjects } from "./utils";

export async function sync(){
  const projects = await getAllProjects();
  for(const p of projects){
    await setup(p);
  }
}
