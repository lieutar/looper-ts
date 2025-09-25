import { isElementNode, type ContainerDOMNode } from "@src/types";

interface queryElementParams{
from: ContainerDOMNode;
path: [string, ... string[]];
ignoreCase?: boolean;
}
export function queryElement(params:queryElementParams):Element | null{
  const from = params.from;
  const [head, ... rest] = params.path;
  const expected = params.ignoreCase ? head.toLowerCase() : head;
  let child = from.firstChild;
  while(child){
    if(isElementNode(child)){
      const tagName = params.ignoreCase ? child.tagName.toLowerCase() : child.tagName;
      if(tagName === expected){
        if(rest.length === 0) return child;
        return queryElement({... params, from: child, path: rest as any});
      }
    }
    child = child.nextSibling;
  }
  return null;
}
