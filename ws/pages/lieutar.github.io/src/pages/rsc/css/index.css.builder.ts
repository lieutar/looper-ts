import { Eero } from 'eero';
import { background, basicStyles, block, filter, flex, inlineBlock, outline, size, Stylo, text, ZLayer} from 'stylo';
import { BuilderScript, type IResponseWriter, type IScriptChainContext } from 'scroute';


export default class extends BuilderScript{

  override async buildResponse(_: IScriptChainContext, res: IResponseWriter){
    await res.header({'Content-Type': 'text/css'});

    const textColor = Eero.from( '#000E' );

    const baseLayer           = new ZLayer();
    const sectionLayer        = baseLayer.fg();
    const sectionHeadingLayer = sectionLayer.base.fg();

    const global = Stylo.global();
    global.include(basicStyles({ color: textColor.toString()}));

    global.child('h2', block({
      ... size( 'fit-content'),
      ... text({
        color: '#963E',
        align: 'left',
        size: '1.5rem',
      }),
      ... background({blur:8}),
      ... sectionHeadingLayer.position('relative',{before : {
        left: '-2rem',
        ... outline({
          padding: '0px 2rem',
          radius: '2rem',
        }),
        ... background({color: '#FFF3'}),
        ... filter({blur:4}),
      }}),
    }));

    global.child('h3', block({
        ... text({ size: '1.5rem' }),
        ... sectionHeadingLayer.position('relative', {before : {
          bottom: '0',
          ... size('100%', '.5em'),
          ... background({color: '#9633'}),
        }})
    }));

    global.child('h4', block({
      ... outline({
        radius: '1rem',
        padding: '0 .5rem',
      }),
      ...size('fit-content'),
      ...background({
        color: textColor.mod(c=>{c.b += 0.2; c.g += 0.2}).toString(),
      }),
      ... text({
        shadow: 'none',
        color:  '#FFFE',
      }),
      ... sectionHeadingLayer.position('relative'),
    }));

    const body = global.child('body', flex({
        ... baseLayer.position('relative'),
        flexDirection: 'column',
        minHeight: '100vh',

        ... background({
          url: '../img/background.svg',
          size: 'max(98vh, 300px) max(110vh, 300px)',
          position: "50% -5vh"
          }),

    }));

    const mainHeader = global.child('#main-header', {
      ... baseLayer.position('relative'),
      flexGrow: '0',
      ... size('100%','2rem'),
      ... background({
        linearGradient: 'to bottom, #123C, #FFF0',
        repeat: 'no-repeat',
        size: '100% 100%',
      }),
      ... text({ color: '#FFFFFFF0' }),
      ... outline({ padding: '.25rem .25rem 1rem .25rem', }),
    });

    mainHeader.child('h1', {
      ... baseLayer.position('absolute'),
      top: '0', right: '.25rem',
      ... size('fit-content'),
    });

    const breadCrumbs = mainHeader.child('#bread-crumbs', {
      ... baseLayer.position('absolute'),
      top: '0', left: '.25rem',
    });

    breadCrumbs.child('a', inlineBlock({
      ... outline({margin: '0'}),
      ... text({
        color: 'white !important',
        weight: 900
      })
    }));


    const main = body.child('> main', { flexGrow: '2', });
    body.child('#main-footer', {
      flexGrow: '0',
      padding: '.25em',
      textAlign: 'right'
    });

    const rootSection = main.child('section', { ... sectionLayer.position('relative'), });
    const rootArticle = rootSection.child('article', { margin: '0px 1rem'});

    rootArticle.child('.article-content', {
      padding: '1rem',
      ... sectionLayer.base.position('relative',{before:{
        top:            '-.5rem',
        borderRadius:   '1rem',
        ... background({
          color: '#FFF9EECC',
          blur: 8
        }),
        ... filter({blur:1})
      }})
    });

    rootArticle.child('section', {
      '& article' : {
        margin: 0,
        ... background({
          filter: 'none',
          image: 'none',
        }),
        '& section' : {
          marginTop: '1rem',
        }
      }
    });

    await res.write(String(global));
  }
}
