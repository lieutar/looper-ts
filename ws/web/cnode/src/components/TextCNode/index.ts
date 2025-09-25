export * from './types';

import { WithTraits } from 'qoop';
import { AbstractCNode } from '../AbstractCNode';
import { TElementHolder } from '../traits';
import { TTextCNodeBase } from './TTextCNodeBase';
import { TStringPlaceholderLogic } from './TStringPlaceholderLogic';
export class TextCNode extends WithTraits(AbstractCNode,
  TTextCNodeBase, TElementHolder, TStringPlaceholderLogic) {}
