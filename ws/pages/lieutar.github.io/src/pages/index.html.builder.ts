import { type PubliBuilderContext, PubliBuilder } from "publi";

export default class extends PubliBuilder{

  override async buildPubliResponse(ctx: PubliBuilderContext){
    const {sec} = ctx.componentBuildersEnv;
    await ctx.writeContents({
      title: 'index',
      requestPath: this.requestPath,
      components: ({F}) => F(
        sec({
          title:   F('Emacs Projects'),
          article: F(['ul', ['li', ['a', {href: 'looper-elpa'}, "looper-elpa"]]])
        }),
        sec({
          title:   F('TypeScript'),
          article: F(['ul', ['li', ['a', {href: 'TypeScriptPolicy.html'}, 'cording policy']]])
        })
      )
    });
  }
}
