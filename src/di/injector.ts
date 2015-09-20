/// <reference path='../../typings/es6-collections/es6-collections.d.ts' />

import {
  DumbMap
} from '../util/dumbmap';

import {
  Binding,
  ResolvedBinding
} from './binding';

import {
  bind
} from './builder';

import {
  Constructor
} from './lang';

/**
 * An Injector is a mapping from type to implementation of type, including
 * factory methods to get an instance of types when needed.
 */
export class Injector {
  /**
   * Create a new injector, given an array of bindings. The most easy to use
   * way to get a new Injector.
   */
  static create(bindings: Array<Binding<any>>, parent: Injector = null) {
    return new Injector(bindings.map((_) => _.resolve()), parent);
  }

  private _bindingLookup: Map<any, ResolvedBinding> =
    new DumbMap<ResolvedBinding>();

  /**
   * Create a new Injector given an array of already resolved bindings.
   */
  constructor(
    resolvedBindings: ResolvedBinding[],
    private parent: Injector
  ) {
    resolvedBindings.map((_) => this._bindingLookup.set(_.key, _));
  }

  /**
   * Create a new injector that uses a new array of target bindings, or values
   * from this injector if not present in the child.
   */
  createChild(bindings: Array<Binding<any>>): Injector {
    return Injector.create(bindings, this);
  }

  /**
   * Retrieve a value from the injector, invoking its factory, as well
   * as passing in any dependent instances.
   */
  get(type: any, optional = false): any {
    if (!this._bindingLookup.has(type)) {
      if (this.parent) {
        return this.parent.get(type, optional);
      } else if (optional === true) {
        return undefined;
      } else {
        throw new Error(`Injector does not have type '${type}'`);
      }
    }
    const binding = this._bindingLookup.get(type);
    // Use this as a quick way to detect one-level-deep circular dependencies.
    const circular = new DumbMap();
    const dependencies: any[] = binding.dependencies.map((_) => {
      if (circular.has(_.token)) {
        throw new Error(`Circular dependency for ${_.token}.`);
      }
      circular.set(_.token, _);
      return this.get(_.token, _.optional);
    });
    return _apply(binding.factory, dependencies);
  }

  getLazy(type: any): () => any {
    return () => null;
  }

  create<T>(type: Constructor<T>): T {
    let Key: any = new Object();
    let injector = this.createChild([bind(Key).toClass(type)]);
    return <T>injector.get(Key);
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
