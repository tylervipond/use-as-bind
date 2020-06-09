import React from "react";

import { useAsBind } from "use-as-bind";

const App = () => {
  const { loaded, instance, error } = useAsBind("example.wasm");
  return (
    <div>
      {loaded && instance.exports.addString("hello", "wasm")}
      {error && error.message}
    </div>
  );
};
export default App;
