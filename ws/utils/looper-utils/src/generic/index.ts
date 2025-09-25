export function genericErrorHandler(message:string = 'An error occurred.'){
  return function(e:unknown){
    if(e instanceof Error) throw e;
    throw new Error(message, {cause: e});
  }
}
