import { f2Dependency } from "f2-dependency";

export function f2Dependent() {
  return `f2-dependent -> ${f2Dependency()}`;
}
