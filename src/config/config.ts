/// <reference path="../../typings/node/node.d.ts" />
export type ConfigPrim = boolean|string|number;
export type ConfigVal = ConfigPrim|Array<string>;
export type ConfigValue = {[k: string]: ConfigVal|ConfigValue};

export class Config {
  private _data: any = {};
  constructor(options: ConfigValue = {}, argv: string[] = []) {
    for (let key in options) {
      if (options.hasOwnProperty(key)) {
        this._data[key] = options[key];
      }
    }
    while (argv.length > 0) {
      let key = argv.shift();
      if (key.indexOf('--') === 0) {
        let val = argv.shift();
        this.set(key.substr(2), val);
      }
    }
  }

  set(key: string, value: ConfigVal) {
    return SET(this._data, key.split('.'), value);
  }

  /**
   * Look up a key, possibly using the environment or setting a value.
   */
  find<V extends ConfigVal>(
    key: string,
    env?: string|V,
    deflt?: V
  ): V {
    if (arguments.length === 2) {
      deflt = <V>env;
      env = null;
    }
    if (env) {
      deflt = FIND<V>(this._data, key.split('.'), deflt);
      let envDeflt = FIND<V>(process.env, [<string>env], deflt);
      return SET<V>(this._data, key.split('.'), envDeflt);
    } else {
      return FIND<V>(this._data, key.split('.'), deflt);
    }
  }

  map(key: string, fn: (_: string) => string): string[] {
    const mapped = toConfigArray(this.find(key, [])).map(fn);
    return toConfigArray(<string[]>this.set(key, mapped));
  }

  append(key: string, arr: string|string[]): string[] {
    let configArr = toConfigArray(arr);
    let list = toConfigArray(this.find(key, [])).concat(configArr);
    return toConfigArray(<string[]>this.set(key, list));
  }

  prepend(key: string, arr: string|string[]): string[] {
    let configArr = toConfigArray(arr);
    let list = configArr.concat(toConfigArray(this.find(key, [])));
    return toConfigArray(<string[]>this.set(key, list));
  }
}

/**
 * Convert a ConfigVal to an array of ConfigPrim.
 * It the value is already an array, return it. Otherwise, return a new
 * array with one element, the value passed.
 */
function toConfigArray(arr: string|string[]): string[] {
  return Array.isArray(arr) ? <string[]>arr : [<string>arr];
}

/**
 * Convenience for `FIND(_, _, _, true)`
 */
function SET<V extends ConfigVal>(
  o: Object, p: string[],
  v: V
): V {
  return FIND<V>(o, p, v, true);
}

/**
 * Utility method to recursively look through an object and return a node.
 * Creates missing nodes along the way. Sets the found node with a value if
 * not present, or if told to force updating.
 *
 * @param obj {Object} to search in.
 * @param path {Array<string>|string} path to follow in the object tree. If a
 *        string, nodes should be dot-separated.
 * @param val {Any} default value to set the found property to if undefined or
 *        if `force` is `true`.
 * @param force {boolean} if `true`, replace the value even if it is set.
 */
function FIND<V extends ConfigVal>(
  obj: any,
  path: string[],
  val?: V,
  force: boolean = false
): V  {
  // Let's follow the next key
  let key = path.shift();
  const hasKey = Object.hasOwnProperty.call(obj, key);
  if (path.length === 0) {
    // We're at the end of the path
    if (obj !== process.env && (force || !hasKey)) {
      // Update the property if either forced or unset.
      obj[key] = val;
    }
    if (obj === process.env) {
      return <V>GET_ENV<V>(key, val);
    } else {
      // Return what's there.
      return <V>obj[key];
    }
  } else {
    // If not set, fill in this position with a new object.
    obj[key] = hasKey ? obj[key] : {};
    // Return `FIND` on the next path part.
    return FIND<V>(obj[key], path, val, force);
  }
}

function GET_ENV<V extends ConfigVal>(key: string, val: V): any {
  // TODO Either use proces.env OR use localStorage.
  const obj = process.env;
  if (!obj[key]) {
    return val;
  }
  // process.env behaves oddly.
  if (obj[key].toLowerCase() === 'false') {
    return false;
  } else if (obj[key].toLowerCase() === 'true') {
    return true;
  } else if (obj[key].toLowerCase() === '') {
    return val ? val : null;
  } else if (val instanceof Number) {
    if (obj[key].indexOf('.') === -1) {
      return parseInt(obj[key], 10);
    } else {
      return parseFloat(obj[key]);
    }
  } else {
    return obj[key];
  }
}
