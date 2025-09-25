import type { AttributeSpecType } from "domlib";
import { type AbstractCNodeParams } from "../AbstractCNode";
import type { AbstractComponentStubParamsType } from "@src/stubs";

export type TextCNodeUniqueType =  {
  formatter?: (src:unknown)=>string;
  defaultValue?: unknown,
  value?: unknown,
}

export type TextCNodeDSLOptType = TextCNodeUniqueType & {
  tagName?: string,
  attributes?: AttributeSpecType
};

export type TextCNodeParamsType = AbstractCNodeParams & TextCNodeDSLOptType & { element: Element };

export type TextCNodeStubParamsType = AbstractComponentStubParamsType & TextCNodeDSLOptType & { id: string };

export type TextCNodeDSLType    = [string, TextCNodeDSLOptType] | [string];
