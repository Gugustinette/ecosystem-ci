import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    // 10 minutes timeout
    testTimeout: 10 * 60 * 1000,
    // Exclude common directories, specially the ecosystem-ci temp directory
    exclude: ['**/node_modules/**', '**/.git/**', '**/.ecosystem-ci/**'],
  },
})
