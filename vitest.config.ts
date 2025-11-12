import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    // 4 minutes timeout
    testTimeout: 240000,
    // Exclude common directories, specially the ecosystem-ci temp directory
    exclude: ['**/node_modules/**', '**/.git/**', '**/.ecosystem-ci/**'],
  },
})
