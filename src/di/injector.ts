/// <reference path='../../typings/es6-collections/es6-collections.d.ts' />

import {
  Binding,
  ResolvedBinding
} from './binding';

/**
 * An Injector is a mapping from type to implementation of type, including
 * factory methods to get an instance of types when needed.
 */
export class Injector {
  /**
   * Create a new injector, given an array of bindings. The most easy to use
   * way to get a new Injector.
   */
  static create(bindings: Array<Binding<any>>) {
    return new Injector(bindings.map((_) => _.resolve()));
  }

  private _bindingLookup: Map<any, ResolvedBinding> =
    new DumbMap<ResolvedBinding>();

  /**
   * Create a new Injector given an array of already resolved bindings.
   */
  constructor(
    resolvedBindings: ResolvedBinding[]
  ) {
    resolvedBindings.map((_) => this._bindingLookup.set(_.key, _));
  }

  /**
   * Retrieve a value from the injector, invoking its factory, as well
   * as passing in any dependent instances.
   */
  get(type: any): any {
    if (!this._bindingLookup.has(type)) {
      throw new Error(`Injector does not have type '${type}'`);
    }
    const binding = this._bindingLookup.get(type);
    // Use this as a quick way to detect one-level-deep circular dependencies.
    const circular = new DumbMap();
    const dependencies: any[] = binding.dependencies.map((_) => {
      if (circular.has(_.token)) {
        throw new Error(`Circular dependency for ${_.token}.`);
      }
      circular.set(_.token, _);
      return this.get(_.token);
    });
    return _apply(binding.factory, dependencies);
  }
}

/* tslint:disable */
function _apply(fn: Function, args: any[]): any {
  switch (args.length) {
    case 0:
      return fn();
    case 1:
      return fn(args[0]);
    case 2:
      return fn(args[0], args[1]);
    case 3:
      return fn(args[0], args[1], args[2]);
    case 4:
      return fn(args[0], args[1], args[2], args[3]);
    case 5:
      return fn(args[0], args[1], args[2], args[3], args[4]);
    case 6:
      return fn(args[0], args[1], args[2], args[3], args[4], args[5]);
    case 7:
      return fn(args[0], args[1], args[2], args[3], args[4], args[5], args[6]);
    case 8:
      return fn(args[0], args[1], args[2], args[3], args[4], args[5], args[6], args[7]);
    case 9:
      return fn(args[0], args[1], args[2], args[3], args[4], args[5], args[6], args[7], args[8]);
    case 10:
      return fn(args[0], args[1], args[2], args[3], args[4], args[5], args[6], args[7], args[8], args[9]);
    default:
      return fn.apply(null, args);
  }
}
/* tslint:enable */

/**
 * This is a really dumb O(n) implementation of a map, because I was
 * having issues with TS and the native ES6 map.
 *
 * TODO(cleanup): remove this for just a normal ES6 Map.
 */
class DumbMap<V> implements Map<any, V> {
  private _dumbArray: Array<DumbKey<V>> = new Array<DumbKey<V>>();

  clear() {
    this._dumbArray.length = 0;
  }

  delete(key: any): boolean {
    const i = this._findIndex(key);
    if ( i === -1 ) {
      return false;
    }
    this._dumbArray.splice(i, 0);
    return true;
  }

  forEach() {
    throw new Error('Unsupported operation.');
  }

  get(key: any): V {
    const i = this._findIndex(key);
    if ( i === -1 ) {
      throw new Error(`Key '${key}' not found.`);
    }
    return this._dumbArray[i].value;
  }

  has(key: any): boolean {
    return this._findIndex(key) > -1;
  }

  set(key: any, value: V): Map<any, V> {
    const dk = new DumbKey(key, value);
    const i = this._findIndex(key);
    if (i > -1) {
      this._dumbArray[i] = dk;
    } else {
      this._dumbArray.push(dk);
    }
    return this;
  }

  entries(): Iterator<[any, V]> {
    throw new Error('Unsupported Operation.');
  }

  keys(): Iterator<any> {
    throw new Error('Unsupported Operation.');
  }

  values(): Iterator<V> {
    throw new Error('Unsupported Operation.');
  }

  get size(): number {
    return this._dumbArray.length;
  }

  private _findIndex(key: any): number {
    for (let i = 0, q = this._dumbArray.length; i < q; i++) {
      if (this._dumbArray[i].key === key) {
        return i;
      }
    }
    return -1;
  }
}

class DumbKey<V> {
  constructor(public key: any, public value: V) {}
}
