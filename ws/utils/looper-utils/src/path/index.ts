/** Canonicalize the path as POSIX notation.
 * This function can't accept file names contains "\".
 */
export function posixifyPath(path: string): string {
  return path.replace(/\\/g, "/").replace(/\/+/g,"/");
}

export function canonicalizeDirectoryPath(path: string): string {
  return posixifyPath(path).replace(/\/$/, "");
}
