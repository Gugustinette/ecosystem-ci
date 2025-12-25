import { f1Dependency } from 'f1-dependency'

export function f1Dependent() {
  return `f1-dependent -> ${f1Dependency()}`
}
