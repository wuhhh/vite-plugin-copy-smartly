# vite-plugin-copy-smartly

This is a not-so-smart hack of the [rollup-copy-smartly](https://github.com/TrickyPi/rollup-copy-smartly) Rollup plugin by TrickyPi. They take all of the credit for this work, I simply changed two hooks to make it work with Vite. This is not battle tested and there may be better ways to achieve this. PRs welcome.

## Features

Smartly copy files if they are changed, created or deleted.

## Getting Started

```console
npm install --save-dev vite-plugin-copy-smartly
```

or

```console
yarn add -D vite-plugin-copy-smartly
```

or

```console
pnpm add -D vite-plugin-copy-smartly
```

## Use

**vite.config.js**

```js
import copy from "vite-plugin-copy-smartly";
export default {
    ...
    plugins: [
       	copy({
			src: path.resolve(__dirname, "src/public/"),
			pattern: /\.(svg|png|jpg|gif|webp|json|lottie)$/,
			dest: path.resolve(__dirname, "web/dist/"),
		}),
    ],
};
```

## Options

| option  | type                | description                                                                          |
| ------- | ------------------- | ------------------------------------------------------------------------------------ |
| src     | string              | Path to dir which will be watching, it could be absolute path or relative path       |
| pattern | RegExp or RegExp[ ] | Filter specific files                                                                |
| dest    | string or string[ ] | Paths to dir which are output directorys, it could be absolute path or relative path |
