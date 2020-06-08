# use-as-bind

> React Hook for using [as-bind](https://github.com/torch2424/as-bind) with a wasm source

[![NPM](https://img.shields.io/npm/v/use-as-bind.svg)](https://www.npmjs.com/package/use-as-bind) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Install

```bash
npm install --save use-as-bind
```

## Basic Usage

```tsx
import * as React from 'react'

import { useAsBind } from 'use-as-bind'

const Example = () => {
  const wasm = useAsBind('path/to/wasm.wasm');
  return (
    <div>
      {wasm.loaded && wasm.instance.exports.exampleFunction()}
      {wasm.error && wasm.error.message}
    </div>
  )
}
```

## API
useAsBind takes two arguments:

`useAsBind(source, imports)`

*source* - `string | WebAssembly.Module | BufferSource | Response | PromiseLike<WebAssembly.Module>` - 
The source of the WebAssembly to be loaded. When a string is passed in it should be a url to a `.wasm` file which will be fetched and then instantiated. For non-string types check out the [as-bind docs for instantiate](https://github.com/torch2424/as-bind#instantiate) 

*options* -`Object` - 
An object that contains functions to be imported. For more information check out the [as-bind docs for importObject](https://github.com/torch2424/as-bind#importobject)

## License

MIT © [tylervipond](https://github.com/tylervipond)

---

This hook is created using [create-react-hook](https://github.com/hermanya/create-react-hook).
