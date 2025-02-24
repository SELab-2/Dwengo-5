# sv

Everything you need to build a Svelte project, powered by [`sv`](https://github.com/sveltejs/cli).

## Creating a project

If you're seeing this, you've probably already done this step. Congrats!

```bash
# create a new project in the current directory
npx sv create

# create a new project in my-index
npx sv create my-index
```

## Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```bash
npm run dev

# or start the server and open the index in a new browser tab
npm run dev -- --open
```

## Building

To create a production version of your index:

```bash
npm run build
```

You can preview the production build with `npm run preview`.

> To deploy your index, you may need to install an [adapter](https://svelte.dev/docs/kit/adapters) for your target environment.
