import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    // 2 minutes timeout
    testTimeout: 120000,
    // Exclude common directories, specially the ecosystem-ci temp directory
    exclude: ['**/node_modules/**', '**/.git/**', '**/.ecosystem-ci/**'],
  },
})
