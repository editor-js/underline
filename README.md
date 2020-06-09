![](https://badgen.net/badge/Editor.js/v2.0/blue)

# Underline Tool
Inline tool for underlining text fragments for the [Editor.js](https://github.com/codex-team/editor.js)

![](editorjs-underline.gif)

## Installation

### Install via NPM

Get the package

```shell
npm i --save @editorjs/underline
```

```shell
yarn add @editorjs/underline
```

Include module at your application

```javascript
import Underline from '@editorjs/underline';
```

### Download to your project's source dir

1. Upload folder `dist` from repository
2. Add `dist/bundle.js` file to your page.

### Load from CDN

You can load the package from [jsDelivr CDN](https://www.jsdelivr.com/package/npm/@editorjs/underline) and require the script on a page with Editor.js.

```html
<script src="https://cdn.jsdelivr.net/npm/@editorjs/underline@latest"></script>
```

## Usage

Add a new Tool to the `tools` property of the Editor.js initial config.

```javascript
import EditorJs from '@editorjs/editorjs';
import Underline from '@editorjs/underline';

var editor = new EditorJS({
  // ...
  tools: {
    // ...
    underline: Underline
  },
});
```

## Config Params

This Tool has no config params

## Output data

Underlined text will be wrapped with a `u` tag with an `cdx-underline` class.

```json
{
    "type" : "text",
    "data" : {
        "text" : "Create a directory for your module, enter it and run <u class=\"cdx-underline\">npm init</u> command."
    }
}
```
