import {  InitTProp, makeMixer, qoop } from "qoop";
import type { AbstractCNode, CNodeTemplateBuilderType, GenericCNode } from "cnode";
import type { Constructor } from "looper-utils";

export type SemanticComponentClassType =
  Constructor<AbstractCNode> & {getDefaultTemplateResolver():IComponentTemplateResolver};
export type SemanticComponent = InstanceType<SemanticComponentClassType>;
export interface IComponentTemplateResolver {
  resolve(data: AbstractCNode): CNodeTemplateBuilderType;
}

@qoop({})
export class TemplateResolver{

  private _resolvers: Map<SemanticComponentClassType, IComponentTemplateResolver> = new Map();

  register(about: SemanticComponentClassType, resolver:IComponentTemplateResolver){
    this._resolvers.set(about, resolver); }

  of(about: SemanticComponentClassType){
    const registered = this._resolvers.get(about);
    if(registered) return registered;
    const fallback = about.getDefaultTemplateResolver();
    this.register(about, fallback);
    return fallback; }

  resolve(component: SemanticComponent):CNodeTemplateBuilderType{
    const resolver = this.of((component as any).constructor);
    return resolver.resolve(component);
  }
}

@qoop({Trait:{}, AutoInit:{}})
export class TemplateResolverHolder{

  @InitTProp(function(_){ return new TemplateResolver() }) declare readonly templateResolver: TemplateResolver;

  queryTemplate(from: SemanticComponent) : GenericCNode | null {
    const manager = from.manager;
    const builder = this.templateResolver.resolve(from);
    if( !builder ) return null;
    const result = manager.create(builder) as GenericCNode;
    result.setOriginal(from);
    return result;
  }
}

export const TTemplateResolver = makeMixer<TemplateResolverHolder>(TemplateResolverHolder)
