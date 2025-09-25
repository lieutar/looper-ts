import { type CNodeSpecType } from "../../types";
import { type AbstractCNodeParams } from "../AbstractCNode";
import type { Placeholder } from "../Placeholder";
import type { TextCNode } from "../TextCNode";

export type GenericCNodeParams = AbstractCNodeParams & {
  element:      Element,
  placeholders: PlaceholderDictType,
  textCNodes:   TextCNodeDictType };

export type PlaceholderDictType = {[name:string]: Placeholder};
export type TextCNodeDictType   = {[name:string]: TextCNode[]};

export type GenericCNodeDSLType = [Object | string , CNodeSpecType] | [CNodeSpecType];
