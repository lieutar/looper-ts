import * as monaco from 'monaco-editor';


self.MonacoEnvironment = {
  getWorker: function (_workerId, label) {
    const getWorkerModule = (moduleUrl:string, label:string) => {
      return new Worker(`/node_modules/monaco-editor/esm/vs/${moduleUrl}`, {
	name: label,
	type: 'module'
      });
    };

    const langWorkerModule = (dir:string, lang:string, label:string) =>
      getWorkerModule(`language/${dir}/${lang}.workerr`, label);

    switch (label) {
      case 'json':
	return langWorkerModule('json','json',label);
      case 'css':
      case 'scss':
      case 'less':
        return langWorkerModule('css', 'css', label);
      case 'html':
      case 'handlebars':
      case 'razor':
        return langWorkerModule('html', 'html', label);
      case 'typescript':
      case 'javascript':
        return langWorkerModule('typescript', 'ts', label);
      default:
	return getWorkerModule('editor/editor.worker?worker', label);
    }
  }
};

const doc = document;
if(!doc) throw new Error();
const container = doc.getElementById('container');
if(!container) throw new Error();
monaco.editor.create(container, {
  value: ['function x() {', '\tconsole.log("Hello worlddd!");', '}'].join('\n'),
  language: 'javascript'
});
