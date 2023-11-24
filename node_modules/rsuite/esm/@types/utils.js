'use client';
export var tuple = function tuple() {
  for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }
  return args;
};

/**
 * Prepend arguments to function
 * Useful for prepend `newValue` arg to native `onChange` callbacks
 *
 * @see https://stackoverflow.com/a/69668215
 * @example
 *
 * type SomeFunc = (a: string, b: number, c: someCustomType) => number;
 * type SomeFuncAltered = PrependParameters<SomeFunc, [d: number]>;
 * // SomeFuncAltered = (d: number, a:string, b:number, c:someCustomType) => number;
 */