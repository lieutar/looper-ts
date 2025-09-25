import type { PPick } from "looper-utils";

export type CParams<PropsT, DefaultT> = PPick<PropsT, Exclude<keyof PropsT, keyof DefaultT>>;
