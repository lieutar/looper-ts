import { type StyloSheet as Styles } from './types';

export function size(width:string | number, height?: string | number):Styles{
  const width_  = 'string' === typeof width ? width : `${width}px`;
  const height_ = 'string' === typeof height ? height : (height ? `${height}px` : width_);
  return { width: width_, height: height_ };
}
