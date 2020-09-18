import { renderHook, act } from "@testing-library/react-hooks";
import { useAsBind, createAsBindHook } from "./";

const wasmAsString =
  "AGFzbQEAAAABMAlgAn9/AX9gA39/fwBgAX8AYAJ/fwBgAX8Bf2AAAGAEf39/fwBgAAF/YAN/f38BfwINAQNlbnYFYWJvcnQABgMREAMDAQcAAQgABAIEAQAABQIFAwEAAQZND38BQQALfwFBAAt/AEEBC38AQQELfwBBAAt/AEECC38AQQMLfwBBBAt/AEEFC38AQQYLfwBBBwt/AEEIC38AQQkLfwBBCgt/AEHwCQsHhQMTBm1lbW9yeQIAB19fYWxsb2MACAhfX3JldGFpbgAJCV9fcmVsZWFzZQAKCV9fY29sbGVjdAAPC19fcnR0aV9iYXNlAw4XX19hc2JpbmRfZW50cnlmaWxlX2ZsYWcDAhJfX2FzYmluZF9TdHJpbmdfSUQDAxdfX2FzYmluZF9BcnJheUJ1ZmZlcl9JRAMEG19fYXNiaW5kX0FycmF5QnVmZmVyVmlld19JRAMFFV9fYXNiaW5kX0ludDhBcnJheV9JRAMGFl9fYXNiaW5kX1VpbnQ4QXJyYXlfSUQDBxZfX2FzYmluZF9JbnQxNkFycmF5X0lEAwgXX19hc2JpbmRfVWludDE2QXJyYXlfSUQDCRZfX2FzYmluZF9JbnQzMkFycmF5X0lEAwoXX19hc2JpbmRfVWludDMyQXJyYXlfSUQDCxhfX2FzYmluZF9GbG9hdDMyQXJyYXlfSUQDDBhfX2FzYmluZF9GbG9hdDY0QXJyYXlfSUQDDQlhZGRTdHJpbmcADgrnFBCeAgEEfyABKAIAIgJBAXFFBEBBAEGQCEGVAkEOEAAACyACQXxxIgJBEE8EfyACQfD///8DSQVBAAtFBEBBAEGQCEGXAkEOEAAACyACQYACSQRAIAJBBHYhAgUgAkEfIAJnayIEQQRrdkEQcyECIARBB2shBAsgAkEQSUEAIARBF0kbRQRAQQBBkAhBpAJBDhAAAAsgASgCFCEDIAEoAhAiBQRAIAUgAzYCFAsgAwRAIAMgBTYCEAsgASAAIAIgBEEEdGpBAnRqKAJgRgRAIAAgAiAEQQR0akECdGogAzYCYCADRQRAIAAgBEECdGoiAygCBEEBIAJ0QX9zcSEBIAMgATYCBCABRQRAIAAgACgCAEEBIAR0QX9zcTYCAAsLCwuCBAEHfyABRQRAQQBBkAhBzQFBDhAAAAsgASgCACIEQQFxRQRAQQBBkAhBzwFBDhAAAAsgAUEQaiABKAIAQXxxaiIFKAIAIgJBAXEEQCAEQXxxQRBqIAJBfHFqIgNB8P///wNJBEACfyAAIAUQASABIAMgBEEDcXIiBDYCACABQRBqIAEoAgBBfHFqIgUoAgALIQILCyAEQQJxBEACfyABQQRrKAIAIgMoAgAiB0EBcUUEQEEAQZAIQeQBQRAQAAALIAdBfHFBEGogBEF8cWoiCEHw////A0kEfyAAIAMQASADIAggB0EDcXIiBDYCACADBSABCwshAQsgBSACQQJyNgIAIARBfHEiA0EQTwR/IANB8P///wNJBUEAC0UEQEEAQZAIQfMBQQ4QAAALIAMgAUEQamogBUcEQEEAQZAIQfQBQQ4QAAALIAVBBGsgATYCACADQYACSQRAIANBBHYhAwUgA0EfIANnayIEQQRrdkEQcyEDIARBB2shBgsgA0EQSUEAIAZBF0kbRQRAQQBBkAhBhAJBDhAAAAsgACADIAZBBHRqQQJ0aigCYCEEIAFBADYCECABIAQ2AhQgBARAIAQgATYCEAsgACADIAZBBHRqQQJ0aiABNgJgIAAgACgCAEEBIAZ0cjYCACAAIAZBAnRqIgAgACgCBEEBIAN0cjYCBAvRAQECfyACQQ9xRUEAIAFBD3FFQQAgASACTRsbRQRAQQBBkAhBggNBBRAAAAsgACgCoAwiAwRAIAEgA0EQakkEQEEAQZAIQYwDQRAQAAALIAMgAUEQa0YEQAJ/IAMoAgAhBCABQRBrCyEBCwUgASAAQaQMakkEQEEAQZAIQZgDQQUQAAALCyACIAFrIgJBMEkEQA8LIAEgBEECcSACQSBrQQFycjYCACABQQA2AhAgAUEANgIUIAEgAmpBEGsiAkECNgIAIAAgAjYCoAwgACABEAILmwEBA38jACIARQRAQQE/ACIASgR/QQEgAGtAAEEASAVBAAsEQAALQdAKIgBBADYCAEHwFkEANgIAA0AgAUEXSQRAIAFBAnRB0ApqQQA2AgRBACECA0AgAkEQSQRAIAFBBHQgAmpBAnRB0ApqQQA2AmAgAkEBaiECDAELCyABQQFqIQEMAQsLQdAKQYAXPwBBEHQQA0HQCiQACyAAC9oBAQF/IAFBgAJJBEAgAUEEdiEBBSABQQFBGyABZ2t0akEBayABIAFB+P///wFJGyIBQR8gAWdrIgJBBGt2QRBzIQEgAkEHayECCyABQRBJQQAgAkEXSRtFBEBBAEGQCEHSAkEOEAAACyAAIAJBAnRqKAIEQX8gAXRxIgEEfyAAIAFoIAJBBHRqQQJ0aigCYAUgACgCAEF/IAJBAWp0cSIBBH8gACABaCIBQQJ0aigCBCICRQRAQQBBkAhB3wJBEhAAAAsgACACaCABQQR0akECdGooAmAFQQALCwuHAQECfyABKAIAIQMgAkEPcQRAQQBBkAhB7QJBDhAAAAsgA0F8cSACayIEQSBPBEAgASACIANBAnFyNgIAIAIgAUEQamoiASAEQRBrQQFyNgIAIAAgARACBSABIANBfnE2AgAgAUEQaiIAIAEoAgBBfHFqIAAgASgCAEF8cWooAgBBfXE2AgALC6UCAQN/IwEEQEEAQZAIQfQDQQ4QAAALIAFB8P///wNPBEBBwAhBkAhBzQNBHhAAAAsgACABQQ9qQXBxIgNBECADQRBLGyIEEAUiA0UEQEEBJAFBACQBIAAgBBAFIgNFBEBBED8AIgNBEHRBEGsgACgCoAxHdCAEQQFBGyAEZ2t0QQFraiAEIARB+P///wFJG2pB//8DakGAgHxxQRB2IQUgAyAFIAMgBUobQABBAEgEQCAFQABBAEgEQAALCyAAIANBEHQ/AEEQdBADIAAgBBAFIgNFBEBBAEGQCEGABEEUEAAACwsLIAMoAgBBfHEgBEkEQEEAQZAIQYgEQQ4QAAALIANBADYCBCADIAI2AgggAyABNgIMIAAgAxABIAAgAyAEEAYgAwsNABAEIAAgARAHQRBqC2EBAn8gAEHMCksEQCAAQRBrIgEoAgQiAkGAgICAf3EgAkEBakGAgICAf3FHBEBBAEGACUHtAEEDEAAACyABIAJBAWo2AgQgASgCAEEBcQRAQQBBgAlB8ABBDhAAAAsLIAALEgAgAEHMCksEQCAAQRBrEBALCw0AIABBEGsoAgxBAXYLsAIBAn8CQCACIQQgACABRg0AIAAgAUkEQCABQQdxIABBB3FGBEADQCAAQQdxBEAgBEUNBCAEQQFrIQQgACICQQFqIQAgASIDQQFqIQEgAiADLQAAOgAADAELCwNAIARBCE8EQCAAIAEpAwA3AwAgBEEIayEEIABBCGohACABQQhqIQEMAQsLCwNAIAQEQCAAIgJBAWohACABIgNBAWohASACIAMtAAA6AAAgBEEBayEEDAELCwUgAUEHcSAAQQdxRgRAA0AgACAEakEHcQRAIARFDQQgBEEBayIEIABqIAEgBGotAAA6AAAMAQsLA0AgBEEITwRAIARBCGsiBCAAaiABIARqKQMANwMADAELCwsDQCAEBEAgBEEBayIEIABqIAEgBGotAAA6AAAMAQsLCwsLhwEBBX8CfyAAEAkiAkHQCSACGyEDIAEQCSIFEAkiAEUEQAJ/IABB0AlHBEAgABAKC0HQCQshAAsgAxALQQF0IgQgABALQQF0IgZqIgFFBEAgABAKQfAJDAELIAFBARAIEAkiASADIAQQDCABIARqIAAgBhAMIAAQCiABCyEAIAIQCiAFEAogAAstAQJ/IAAQCSEAIAEQCSEBIABBsAkQDSICIAEQDSEDIAIQCiAAEAogARAKIAMLAwABC8YBAQJ/IAAoAgQiAkH/////AHEhASAAKAIAQQFxBEBBAEGACUH6AEEOEAAACyABQQFGBEACQAJAAkAgAEEIaigCAA4LAgIAAAAAAAAAAAABCyAAKAIQIgEEQCABQcwKTwRAIAFBEGsQEAsLDAELAAsgAkGAgICAeHEEQEEAQYAJQf4AQRIQAAALIAAgACgCAEEBcjYCACMAIAAQAgUgAUEATQRAQQBBgAlBiAFBEBAAAAsgACABQQFrIAJBgICAgH9xcjYCBAsLC8ICBwBBgAgLLR4AAAABAAAAAQAAAB4AAAB+AGwAaQBiAC8AcgB0AC8AdABsAHMAZgAuAHQAcwBBsAgLNygAAAABAAAAAQAAACgAAABhAGwAbABvAGMAYQB0AGkAbwBuACAAdABvAG8AIABsAGEAcgBnAGUAQfAICy0eAAAAAQAAAAEAAAAeAAAAfgBsAGkAYgAvAHIAdAAvAHAAdQByAGUALgB0AHMAQaAJCxECAAAAAQAAAAEAAAACAAAAIABBwAkLFwgAAAABAAAAAQAAAAgAAABuAHUAbABsAEHkCQsFAQAAAAEAQfAJC1kLAAAAIAAAAAAAAAAgAAAAAAAAACAAAAAAAAAAYQgAAAIAAABhAAAAAgAAAKEIAAACAAAAoQAAAAIAAAAhCQAAAgAAACEBAAACAAAAIRkAAAIAAAAhGgAAAg==";

function stringToBuffer(str: string) {
  const binaryString = Buffer.from(str, "base64").toString("binary");
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

const wasmBuffer = stringToBuffer(wasmAsString);

describe("useAsBind", () => {
  it("should return the default state before the wasm is instantiated", async () => {
    const { result } = renderHook(() => useAsBind(wasmBuffer));
    expect(result.current.loaded).toBe(false);
    expect(result.current.instance).toBe(null);
    expect(result.current.error).toBe(null);
  });

  it("should return a state with an error if there was an issue instantiating the wasm", async () => {
    const { result, waitForNextUpdate } = renderHook(() =>
      useAsBind(Uint8Array.from([1, 2, 3, 4]))
    );
    await act(async () => await waitForNextUpdate());
    expect(result.current.loaded).toBe(false);
    expect(result.current.instance).toBe(null);
    expect(result.current.error).toBeInstanceOf(WebAssembly.CompileError);
  });

  it("should return a state with an instance if the hook was called with an BufferSource", async () => {
    const { result, waitForNextUpdate } = renderHook(() =>
      useAsBind(wasmBuffer)
    );
    await act(async () => await waitForNextUpdate());
    expect(result.current.instance?.exports).toBeTruthy();
    expect(result.current.instance?.exports).toHaveProperty("addString");
  });

  it("should return a state with an instance if the hook was called with a WebAssembly Module", async () => {
    const wasmModule = new WebAssembly.Module(wasmBuffer);
    const { result, waitForNextUpdate } = renderHook(() =>
      useAsBind(wasmModule)
    );
    await act(async () => await waitForNextUpdate());
    expect(result.current.instance?.exports).toBeTruthy();
    expect(result.current.instance?.exports).toHaveProperty("addString");
  });

  it("should return a state with an instance if the hook was called with a Response", async () => {
    const wasmResponse = new Response(wasmBuffer);
    const { result, waitForNextUpdate } = renderHook(() =>
      useAsBind(wasmResponse)
    );
    await act(async () => await waitForNextUpdate());
    expect(result.current.instance?.exports).toBeTruthy();
    expect(result.current.instance?.exports).toHaveProperty("addString");
  });

  it("should return a state with an instance if the hook was called with a Promise that resolves to a Webassembly Module", async () => {
    const wasmModulePromise = Promise.resolve(
      new WebAssembly.Module(wasmBuffer)
    );
    const { result, waitForNextUpdate } = renderHook(() =>
      useAsBind(wasmModulePromise)
    );
    await act(async () => await waitForNextUpdate());
    expect(result.current.instance?.exports).toBeTruthy();
    expect(result.current.instance?.exports).toHaveProperty("addString");
  });

  describe("when the hook is called with a string", () => {
    afterEach(() => {
      jest.clearAllMocks();
    });
    it("should return a state with an instance if successful", async () => {
      globalThis.fetch = jest.fn(() =>
        Promise.resolve(new Response(wasmBuffer))
      );

      const wasmUrl = "test.wasm";
      const { result, waitForNextUpdate } = renderHook(() =>
        useAsBind(wasmUrl)
      );
      await act(async () => await waitForNextUpdate());
      expect(result.current.instance?.exports).toBeTruthy();
      expect(result.current.instance?.exports).toHaveProperty("addString");
    });

    it("should return a state with an error if there was an issue fetching the resource", async () => {
      globalThis.fetch = jest.fn(() =>
        Promise.resolve(
          new Response(wasmBuffer, {
            status: 404,
          })
        )
      );

      const wasmUrl = "test.wasm";
      const { result, waitForNextUpdate } = renderHook(() =>
        useAsBind(wasmUrl)
      );
      await act(async () => await waitForNextUpdate());
      expect(result.current.error).toBeInstanceOf(Error);
    });
  });
});

describe("createAsBindHook", () => {
  it("should take an source argument, and return a function that returns a useAsBind hook", async () => {
    const useMyWasm = createAsBindHook(wasmBuffer);
    expect(useMyWasm).toBeInstanceOf(Function);
    const { result, waitForNextUpdate } = renderHook(() => useMyWasm());
    await act(async () => await waitForNextUpdate());
    expect(result.current.instance?.exports).toBeTruthy();
    expect(result.current.instance?.exports).toHaveProperty("addString");
  });
});
