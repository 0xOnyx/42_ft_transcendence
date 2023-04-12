import { sveltekit } from '@sveltejs/kit/vite';

/** @type {import('vite').UserConfig} */
const config = {
	plugins: [sveltekit()],
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}']
	},
    server: {
        port: 3001,
        host: true,
        strictPort: true,
		watch : {
			usePolling: true
		}
    }
};

export default config;
