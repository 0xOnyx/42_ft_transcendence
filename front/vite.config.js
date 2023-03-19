import { sveltekit } from '@sveltejs/kit/vite';

/** @type {import('vite').UserConfig} */
const config = {
	plugins: [sveltekit()],
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}']
	},
    server: {
        host: '0.0.0.0',
		watch : {
			usePolling: true
		}
    }
};

export default config;
