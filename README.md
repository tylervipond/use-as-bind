# use-as-bind

> React Hook for using [as-bind](https://github.com/torch2424/as-bind) with a WASM source

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![NPM](https://img.shields.io/npm/v/use-as-bind.svg)](https://www.npmjs.com/package/use-as-bind)
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)
![CI](https://github.com/tylervipond/use-as-bind/workflows/CI/badge.svg)

## Install

```bash
npm install react as-bind use-as-bind
```

## Basic Usage

```tsx
import * as React from "react";

import { useAsBind } from "use-as-bind";

const Example = () => {
  const { loaded, instance, error } = useAsBind("path/to/wasm.wasm");
  return (
    <div>
      {loaded && instance.exports.exampleFunction()}
      {error && error.message}
    </div>
  );
};
```

For convenience a hook creator is included:

```tsx
import * as React from "react";

import { createAsBindHook } from "use-as-bind";

const useMyWasm = createAsBindHook("path/to/my-wasm.wasm", {
  imports: {
    consoleLog: (message) => {
      console.log(message);
    },
  },
});

const Example = () => {
  const { loaded, instance, error } = useMyWasm();
  return (
    <div>
      {loaded && instance.exports.exampleFunction()}
      {error && error.message}
    </div>
  );
};
```

## API

useAsBind takes two arguments:

`useAsBind(source, options)`

**_source_** - `string | WebAssembly.Module | BufferSource | Response | PromiseLike<WebAssembly.Module>` -
The source of the WebAssembly to be loaded. When a string is passed in it should be a url to a `.wasm` file which will be fetched and then instantiated. For non-string types check out the [as-bind docs for instantiate](https://github.com/torch2424/as-bind#instantiate)

**_options_** - `Object` - An object that contains options to be used with as-bind and internally within the hook:

- _imports_ - `Object` - An object of references to be made available to the loaded WASM file. For more information check out the [as-bind docs for importObject](https://github.com/torch2424/as-bind#importobject)

## License

MIT © [tylervipond](https://github.com/tylervipond)

---

This hook is created using [create-react-hook](https://github.com/hermanya/create-react-hook).
