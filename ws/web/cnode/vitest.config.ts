import { defineConfig } from 'vitest/config';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    isolate: true,
    globals: true,
    include: [
      './test/scripts/**/*.test.ts',
      './test/scripts/**/*.test-d.ts'
    ],
    coverage: {
      enabled: true,
      reporter: ['text', 'html'],
      exclude: [
        './src/fs/boundary.ts'
      ]
    },
  },
});
