import { unrun as unrunNpm } from 'unrun-npm'

export async function unrun(options) {
  throw new Error('Force throw for testing purposes')
  return unrunNpm(options)
}
