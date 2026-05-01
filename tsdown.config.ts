import { defineConfig } from 'tsdown'

export default defineConfig({
	clean: true,
	deps: {
		neverBundle: ['react'],
	},
	dts: true,
	entry: ['src/index.ts'],
	fixedExtension: true,
	format: ['esm', 'cjs'],
	outDir: 'dist',
	platform: 'browser',
	target: 'es2025',
	treeshake: true,
})
