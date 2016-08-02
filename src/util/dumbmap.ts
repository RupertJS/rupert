/**
 * This is a really dumb O(n) implementation of a map, because I was
 * having issues with TS and the native ES6 map.
 *
 * TODO(cleanup): remove this for just a normal ES6 Map.
 */
export class DumbMap<V> implements Map<any, V> {
  private _dumbArray: Array<DumbKey<V>> = new Array<DumbKey<V>>();

  clear() { this._dumbArray.length = 0; }

  delete (key: any): boolean {
    const i = this._findIndex(key);
    if (i === -1) {
      return false;
    }
    this._dumbArray.splice(i, 0);
    return true;
  }

  forEach() { throw new Error('Unsupported operation.'); }

  get(key: any): V {
    const i = this._findIndex(key);
    if (i === -1) {
      throw new Error(`Key '${key}' not found.`);
    }
    return this._dumbArray[i].value;
  }

  has(key: any): boolean { return this._findIndex(key) > -1; }

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

  entries(): Iterator<[any, V]> { throw new Error('Unsupported Operation.'); }

  keys(): Iterator<any> { throw new Error('Unsupported Operation.'); }

  values(): Iterator<V> { throw new Error('Unsupported Operation.'); }

  get size(): number { return this._dumbArray.length; }

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
