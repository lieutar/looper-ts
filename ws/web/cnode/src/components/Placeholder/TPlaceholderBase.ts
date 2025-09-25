import type { PPick } from "looper-utils";
import { AbstractCNode } from "../AbstractCNode";
import { Init, makeMixer, qoop, } from "qoop";
import type { Placeholder, PlaceholderProps } from ".";

export type PlaceholderParams = PPick<PlaceholderProps, 'manager'|'begin'|'end'>;

@qoop({AutoInit:{}, Trait:{}})
export class PlaceholderBase {

  @Init() declare protected owner: Placeholder & { data: AbstractCNode[] };

  get markers() : {begin: Node, end: Node}{
    this.owner.requiresAlive();
    const markers = this.owner.manager.getPlaceholderMarkers( this.owner );
    if(!markers) throw new Error();
    return markers;
  }

  async fillValues(get: (key: string) => unknown): Promise<void> {
    await this.owner.assertAvailable();
    await Promise.all(this.owner.data.map((c:AbstractCNode) => c.fillValues(get)));
  }

  async disposeAsPlaceholder(){
    await this.owner.assertAvailable();
    for( const e of this.owner.data ) await e.dispose();
    this.owner.manager.unbindPlaceholder(this.owner);
  }
}

export const TPlaceholderBase = makeMixer<PlaceholderBase>(PlaceholderBase)
