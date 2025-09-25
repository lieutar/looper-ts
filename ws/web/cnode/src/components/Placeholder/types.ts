import type { PPick } from "looper-utils";
import { AbstractCNode, type AbstractCNodeProps } from "../AbstractCNode";

export interface PlaceholderProps extends AbstractCNodeProps {
  begin:    Node;
  end:      Node;
  entities: AbstractCNode[] | null;
  filter:   (components:AbstractCNode[]) => AbstractCNode[];
  cond:     (env: (key:string)=>unknown)=>boolean;
}

export type { DisposeOptionsType } from './TEntityManager';

export type PlaceholderParams = PPick<PlaceholderProps, 'manager'|'begin'|'end'>;
