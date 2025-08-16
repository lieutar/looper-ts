export default {
  packageJson( pkg:any ){
    delete pkg.devDependencies['looper-ts'];
  }
};
