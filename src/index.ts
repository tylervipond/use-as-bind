import { useEffect, useState } from "react";
import { AsBind, AsBindInstance } from "as-bind";

export interface UseAsBindState<E = Object, I = Object> {
  loaded: boolean;
  error: Error | null;
  instance: AsBindInstance<E, I> | null;
}

export interface UseAsBindOptions {
  imports: { [key: string]: any };
}

const DEFAULT_OPTIONS = {
  imports: {},
};

const fetchWasm = async (
  path: string,
  abortSignal: AbortSignal
): Promise<Response> => {
  let response = await globalThis.fetch(path, { signal: abortSignal });
  if (!response.ok) {
    throw new Error(`Failed to fetch resource ${path}.`);
  }
  return response;
};

export const useAsBind = <E, I>(
  source:
    | string
    | WebAssembly.Module
    | BufferSource
    | Response
    | PromiseLike<WebAssembly.Module>,
  options: UseAsBindOptions = DEFAULT_OPTIONS
): UseAsBindState<E, I> => {
  const [state, setState] = useState<UseAsBindState<E, I>>({
    loaded: false,
    error: null,
    instance: null,
  });
  useEffect(() => {
    const abortController = new AbortController();
    const bindWasm = async () => {
      try {
        const resolvedSource = await (typeof source === "string"
          ? fetchWasm(source, abortController.signal)
          : source);
        const instance = await AsBind.instantiate<E, I>(
          resolvedSource,
          options.imports
        );
        if (!abortController.signal.aborted) {
          setState({ loaded: true, instance, error: null });
        }
      } catch (e) {
        if (!abortController.signal.aborted) {
          setState({ ...state, error: e });
        }
      }
    };
    bindWasm();
    return function cleanup() {
      abortController.abort();
    };
  }, []);
  return state;
};
