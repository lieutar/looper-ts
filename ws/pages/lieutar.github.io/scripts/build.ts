import { DxmlBuilder } from "dxml-publi";
import { staticDriverWithPackageDir, defaultSuffixRules } from "scroute";

await (await staticDriverWithPackageDir({
  importMeta:   import.meta,
  distDir:      '@pkg/dist/pages',
  documentRoot: '@pkg/src/pages',
  suffixRules: [ ['.dxml', DxmlBuilder], ... defaultSuffixRules ]
})).build();
