import { useEffect, useState } from "react";
import { AsBind } from "as-bind";

export interface AsBindInstance<T> {
  exports: T;
  unboundExports: T;
  importObjects: any;
  enableExportFunctionTypeCaching: () => void;
  disableExportFunctionTypeCaching: () => void;
  enableImportFunctionTypeCaching: () => void;
  disableImportFunctionTypeCaching: () => void;
}

export interface UseAsBindState<T = Object> {
  loaded: boolean;
  error: Error | null;
  instance: AsBindInstance<T> | null;
}

export interface UseAsBindOptions {
  imports: { [key: string]: any };
}

const DEFAULT_OPTIONS = {
  imports: {},
};

export const useAsBind = <T>(
  source:
    | string
    | WebAssembly.Module
    | BufferSource
    | Response
    | PromiseLike<WebAssembly.Module>,
  options: { [key: string]: any } = DEFAULT_OPTIONS
): UseAsBindState<T> => {
  const [state, setState] = useState<UseAsBindState<T>>({
    loaded: false,
    error: null,
    instance: null,
  });
  const abortController = new AbortController();
  useEffect(() => {
    const bindWasm = async () => {
      try {
        const instance: AsBindInstance<T> = await AsBind.instantiate(
          typeof source === "string" ? fetch(source) : source,
          options.imports
        );
        setState({ loaded: true, instance, error: null });
      } catch (e) {
        if (!abortController.signal.aborted) {
          setState({ ...state, error: e });
        }
      }
      return () => {
        abortController.abort();
      };
    };
    bindWasm();
  }, []);
  return state;
};
