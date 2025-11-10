import { readFile } from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'
import { pathToFileURL } from 'node:url'
import { createConfigCoreLoader } from 'unconfig-core'

type Parser = 'native' | 'unrun'

export async function loadConfig(cwd: string): Promise<any> {
  const loader = resolveConfigLoader()
  const parser = createParser(loader)

  const [result] = await createConfigCoreLoader({
    sources: [
      {
        files: ['ecosystem-ci.config'],
        extensions: ['ts', 'mts', 'cts', 'js', 'mjs', 'cjs', 'json', ''],
        parser,
      },
    ],
    cwd,
  }).load()

  if (!result) {
    return {}
  }

  const { config } = result
  return await config
}

function resolveConfigLoader(): Parser {
  const nativeTS = !!(
    process.features.typescript ||
    process.versions.bun ||
    process.versions.deno
  )
  return nativeTS ? 'native' : 'unrun'
}

function createParser(loader: Parser) {
  return async (filepath: string) => {
    const basename = path.basename(filepath)
    const isJSON = basename.endsWith('.json')

    if (isJSON) {
      const contents = await readFile(filepath, 'utf8')
      return JSON.parse(contents)
    }

    if (loader === 'native') {
      return nativeImport(filepath)
    }
    return unrunImport(filepath)
  }
}

async function nativeImport(id: string) {
  const mod = await import(pathToFileURL(id).href)
  return mod.default || mod
}

async function unrunImport(id: string) {
  const { unrun } = await import('unrun')
  const { module } = await unrun({
    path: pathToFileURL(id).href,
  })
  return module
}
