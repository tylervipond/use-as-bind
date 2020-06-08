type FunctionPropertyNames<T> = {
  [K in keyof T]: T[K] extends Function ? K : never;
}[keyof T];
type FunctionProperties<T> = Pick<T, FunctionPropertyNames<T>>;

type NonFunctionPropertyNames<T> = {
  [K in keyof T]: T[K] extends Function ? never : K;
}[keyof T];
type NonFunctionProperties<T> = Pick<T, NonFunctionPropertyNames<T>>;

declare module "as-bind" {
  export interface AsBindCacheType {
    type: string;
    key: string;
  }
  export interface AsBindBoundFunction<F extends Function> {
    F;
    cachedArgTypes: AsBindCacheType[];
    shouldCacheTypes: boolean;
    cachedReturnTypes: AsBindCacheType[];
  }

  export interface AsBindBoundFunctions<T> {
    [K: keyof T]: AsBindBoundFunction<FunctionProperties<T>[K]>;
  }
  export interface AsBindBoundObject<T>
    extends NonFunctionProperties<T>,
      AsBindBoundFunctions<T> {}

  export interface AsBindInstance<E, I> {
    exports: AsBindBoundObject<E>;
    unboundExports: E;
    importObjects: AsBindBoundObject<I>;
    enableExportFunctionTypeCaching: () => void;
    disableExportFunctionTypeCaching: () => void;
    enableImportFunctionTypeCaching: () => void;
    disableImportFunctionTypeCaching: () => void;
  }
  export namespace AsBind {
    export function instantiate<E, I>(
      source:
        | WebAssembly.Module
        | BufferSource
        | Response
        | PromiseLike<WebAssembly.Module>,
      imports: AsBindImports
    ): AsBindInstance<E, I>;
    export function instantiateSync<E, I>(
      source:
        | WebAssembly.Module
        | BufferSource
        | Response
        | PromiseLike<WebAssembly.Module>,
      imports: AsBindImports
    ): AsBindInstance<E, I>;
  }
}
