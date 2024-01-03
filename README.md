# stable-chunk-ids-webpack-plugin
Stable chunk ids plugin which supports webpack5+

## Getting Started

To begin, you'll need to install `stable-chunk-ids-webpack-plugin`:

```console
npm install stable-chunk-ids-webpack-plugin --save-dev
```

or

```console
yarn add -D stable-chunk-ids-webpack-plugin
```

or

```console
pnpm add -D stable-chunk-ids-webpack-plugin
```

Then add the plugin to your `webpack` config. For example:

**webpack.config.js**

```js
const StableChunkIdsPlugin = require('stable-chunk-ids-webpack-plugin')

module.exports = {
  plugins: [
    new StableChunkIdsPlugin()
  ]
};
```