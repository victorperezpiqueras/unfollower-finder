import { defineConfig } from 'vitest/config';
import { sveltekit } from '@sveltejs/kit/vite';
import { resolve } from 'path';

export default defineConfig({
	plugins: [sveltekit()],

	test: {
		include: ['src/**/*.{test,spec}.{js,ts}'],
		setupFiles: ['./src/setupTests.ts'],
		globals: true,
		environment: 'jsdom',
		coverage: {
			provider: 'v8',
			reporter: ['text', 'json', 'html'],
			exclude: [
				'./src/setupTest.ts',
				'./src/app.d.ts',
				'./src/lib/index.ts',
				'src/**/*.{test,spec}.{js,ts}'
			],
			include: ['src/**/*.{svelte,ts}']
		}
	},
	resolve: {
		alias: {
			$lib: resolve(__dirname, 'src/lib')
		},
		conditions: ['browser']
	}
});
