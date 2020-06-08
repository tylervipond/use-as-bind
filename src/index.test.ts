import { renderHook, act } from "@testing-library/react-hooks";
import { useAsBind } from "./";

const wasmAsString =
  "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";

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
    const { result, unmount } = renderHook(() => useAsBind(wasmBuffer));
    expect(result.current.loaded).toBe(false);
    expect(result.current.instance).toBe(null);
    expect(result.current.error).toBe(null);
    await act(async () => {
      await unmount();
    });
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
