import { Init, qoop } from 'qoop';
import { type IHttpResponse, type HttpMessageHeaderType, type HttpMessageBodyType} from './types';

@qoop({AutoInit:{}})
export class HttpResponse implements IHttpResponse {
  @Init({default: {'Content-Type' : 'text/plain'}}) header!: HttpMessageHeaderType;
  @Init({default: ''                             }) body!  : HttpMessageBodyType;
  @Init({default: 200                            }) status!: number;
  constructor( _params: Partial<IHttpResponse> = {} ){}
}
