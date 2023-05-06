# create-svelte

Everything you need to build a Svelte project, powered by [`create-svelte`](https://github.com/sveltejs/kit/tree/master/packages/create-svelte).

## Creating a project

If you're seeing this, you've probably already done this step. Congrats!

```bash
# create a new project in the current directory
npm create svelte@latest

# create a new project in my-app
npm create svelte@latest my-app
```

## Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

To create a production version of your app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://kit.svelte.dev/docs/adapters) for your target environment.


## Install Tailwind CSS with SvelteKit

Using npm, install tailwindcss and its peer dependencies, and then run the following commands to generate both tailwind.config.cjs and postcss.config.cjs.

```bash

npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init tailwind.config.cjs -p

```

### Configure your template paths

Add the paths to all of your template files in your tailwind.config.cjs file.

```javascript

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {}
  },
  plugins: []
};

```

### Add the Tailwind directives to your CSS

Create a ./src/app.css file and add the @tailwind directives for each of Tailwind’s layers.


```css

@tailwind base;
@tailwind components;
@tailwind utilities;

```

### Import the CSS file

Create a ./src/routes/+layout.svelte file and import the newly-created app.css file.


```javascript

<script>
  import "../app.css";
</script>

<slot />

```