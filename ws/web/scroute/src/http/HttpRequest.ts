import { Init, qoop } from 'qoop';
import type { IHttpRequest, HttpMessageHeaderType, HttpMessageBodyType } from './types';

@qoop({AutoInit:{}})
export class HttpRequest implements IHttpRequest {
  @Init({default: {}   }) declare header     : HttpMessageHeaderType;
  @Init({default: ''   }) declare body       : HttpMessageBodyType;
  @Init({default: 'GET'}) declare method     : string;
  @Init({default: '/'  }) declare path       : string;
  @Init({default: ''   }) declare queryString: string;
  constructor( _params: Partial<IHttpRequest> = {}){}
}
