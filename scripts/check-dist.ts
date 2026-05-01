import { access, readdir } from 'node:fs/promises'
import { join, relative } from 'node:path'

async function listFiles(directory: string): Promise<string[]> {
	const entries = await readdir(directory, { withFileTypes: true })
	const files = await Promise.all(
		entries.map((entry) => {
			const path = join(directory, entry.name)
			return entry.isDirectory() ? listFiles(path) : [path]
		}),
	)

	return files.flat()
}

const expectedFiles = [
	'dist/index.cjs',
	'dist/index.d.cts',
	'dist/index.d.mts',
	'dist/index.mjs',
].sort()
const files = (await listFiles('dist'))
	.map((file) => relative(process.cwd(), file))
	.sort()

if (files.join('\n') !== expectedFiles.join('\n')) {
	throw new Error(
		`Unexpected dist files:\n${files.join('\n')}\n\nExpected:\n${expectedFiles.join('\n')}`,
	)
}

await access('dist/index.mjs')
await access('dist/index.cjs')
await access('dist/index.d.mts')
await access('dist/index.d.cts')
