import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
    include: ['packages/**/*.test.ts'],
    alias: {
      '@painter/gl-math': 'packages/gl-math/src/index.ts',
    },
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      include: ['packages/**/src/**'],
    },
  },
})
