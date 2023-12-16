import { defineConfig } from 'astro/config';

export default defineConfig({
	site: 'https://madcampos.dev/blog/',
	base: '/blog',
	trailingSlash: 'ignore',
	devToolbar: { enabled: false },
	compressHTML: true,
	build: {
		format: 'directory'
	},
	server: {
		host: 'localhost',
		port: 3000
	},
	markdown: {
		shikiConfig: {
			theme: 'dark-plus'
		}
	}
});
