import type { PackageJson } from "type-fest";

export interface LooperConfig{
  packageJson(pkg:PackageJson):void;
}
