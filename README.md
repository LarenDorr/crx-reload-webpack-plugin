<h1 align="center">crx-reload-webpack-plugin</h1>

![](https://img.shields.io/badge/webpack-4-green.svg?style=for-the-badge&logo=webpack)
![](https://img.shields.io/david/larendorr/crx-reload-webpack-plugin.svg?style=for-the-badge)
![](https://img.shields.io/github/issues-raw/larendorr/crx-reload-webpack-plugin.svg?style=for-the-badge)
![](https://img.shields.io/badge/language-typescript-294E80.svg?style=for-the-badge)
![](https://img.shields.io/github/license/larendorr/crx-reload-webpack-plugin.svg?style=for-the-badge)

A webpack plugin for hot-reload chrome extension in develop.

<h2 align="center">Why</h2>

Befor I develop chrome extension, I found I need a tool to reload extension and website when extension files changed. I found two projects: [wcer](https://github.com/YuraDev/wcer) and [crx-reload](https://github.com/xpl/crx-hotreload).But they not good enough, cann't accord different file change to reload, and wcer no longer update after 2018.1. So, I wirte the plugin for better develop chrome extension.

<h2 align="center">What</h2>

crx-reload-webpack-plugin is a webpack4 plugin for reload extension and website when your extension files changed.

**Features**:
- auto listen manifest.js file change and generate corresponding manifest.json.
- reload different website accord different file change.
  - manifest.js: reload the extension.
  - content: reaload all tab.
  - popup: just reload the popup.html tab.
  - background: just reload background.html tab.
  - options: just reload options.html tab.
  - custom: you can appoint listen files and injected file.

<h2 align="center">How</h2>

**Install**

`npm i -D crx-reload-webpack-plugin`

**Usage**:
```js
const CrxReloadPlugin = require('crx-reload-webpack-plugin')

module.exports = {
  ...: ...,
  plugins: [
    new CrxReloadPlugin({
      manifest: path.resolve(__dirname, './src/manifest.js'),
      port: 9999, // the server port in plugin, be used for notice chrome reload
      path: {
        background: path.resolve(__dirname, './src/background/')
      }
    })
  ],
  ...: ...
}
```
**Options type**:
- **manifest**: `string` (required)

  This is manifest file absolute path. The js file need export a object like manifest.json.
- **port**: `number` (optional)

  Default is `9999`. This is the server's port in plugin. The server is used for notice chrome reload.
- **path**: `object` (optional)
  - **background**: `Array<string>`
  - **options**: `Array<string>`
  - **popup**: `Array<string>`
  - **content**: `Array<string>`

  This object is a collection of absolute paths. Plugin will listen these paths.
  For example:
  ```js
  paths: {
    background: ['work/testExtension/src/background.js'],
    options: ['work/testExtension/src/options/'],
    popup: ['work/testExtension/src/popup.js','work/testExtension/src/popup.html'],
    content: ['work/testExtension/src/options.js']
  }
  ```
  When `paths.options` inclued files change, the options html tab reload, other field same. 
  Its value is a string array, can include file or folder.

  Is's **default value** is:
  ```js
  const context = webpackConfig.context // such as /work/testExtension/src
  paths: {
    background: [path.resolve(context, 'background')], // ../src/background/*
    options: [path.resolve(context, 'options')], // ../src/options/*
    popup: [path.resolve(context, 'popup')], // ../src/popup/*
    content: [path.resolve(context, 'content')] // ../src/content/*
  }
  ```

- **extraPaths** `Array<object>` (optional)
  - **name**: `string`, is a key and it cann't repeat.
  - **inject**: `string`, is a path that is a js files , will be injected.
  - **listens**: `Array<string>`, is a array of path string, when these file changed, reload injected js and its html.

- **logLevel** `string` (optional)

  Default is `error`, it is plugin log level, you can set to `info` to get plugin work detail.

- **autoRetry** `bollean` (optional)

  Default is `false`. When server (in plugin) was stop, this decide client (Chrome) whether auto reconnect. You can manually reload background.js tab.

**Example**

You can reference `template/` and `config/webpack.extension.js`. This is a basic extension develop structure.

**PS:**

I recommand you open `chrome-extension://xxxxxxxxx/_generated_background_page.html` page to develop `background.js`.Otherwise, reload background will failure, because in devtool page(default) cann't get tab's id to reload.