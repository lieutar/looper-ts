import type { DOMProcessor } from "./DOMProcessor";

export interface DOMProcessorRule<T = unknown> {
  when(this:DOMProcessor, node:Node):boolean;
  action(this:DOMProcessor, node:Node):T; }

export type DOMProcessorRuleParam<T = unknown> = Pick<DOMProcessorRule<T>, 'action'> &
        (Pick<DOMProcessorRule<T>, 'when'> | {element: string});

export type DOMProcessorOutputType<T> = (buf: unknown[])=>T;
export interface DOMProcessorProps<T> {
 output:  DOMProcessorOutputType<T>; }
