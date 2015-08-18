/// <reference path="../typings/node/node.d.ts" />

type ConfigPrim = boolean|string|number;
type ConfigVal = ConfigPrim|Array<ConfigPrim>;

export class Config {
  private _data: any = {};
  constructor(options: any = {}) {
    for (let key in options) {
      if (options.hasOwnProperty(key)) {
        this._data[key] = options[key];
      }
    }
  }

  set(key: string, value: ConfigVal) {
    return SET(this._data, key.split('.'), value);
  }

  find(
    key: string,
    env?: ConfigVal,
    deflt?: ConfigVal
  ): ConfigVal {
    if (arguments.length === 2) {
      deflt = env;
      env = null;
    }
    if (env) {
      deflt = FIND(this._data, key.split('.'), deflt);
      let envDeflt = FIND(process.env, [<string>env], deflt);
      return SET(this._data, key.split('.'), envDeflt);
    } else {
      return FIND(this._data, key.split('.'), deflt);
    }
  }

  map(key: string, fn: (_: ConfigPrim) => ConfigPrim): Array<ConfigPrim> {
    const mapped = toConfigArray(this.find(key, [])).map(fn);
    return toConfigArray(this.set(key, mapped));
  }

  append(key: string, arr: ConfigVal): Array<ConfigPrim> {
    let configArr = toConfigArray(arr);
    let list = toConfigArray(this.find(key, [])).concat(configArr);
    return toConfigArray(this.set(key, list));
  }

  prepend(key: string, arr: ConfigVal): Array<ConfigPrim> {
    let configArr = toConfigArray(arr);
    let list = configArr.concat(toConfigArray(this.find(key, [])));
    return toConfigArray(this.set(key, list));
  }
}

function toConfigArray(arr: ConfigVal): Array<ConfigPrim> {
  return arr.constructor === Array ? <Array<ConfigPrim>>arr : [<ConfigPrim>arr];
}

/**
 * Convenience for `FIND(_, _, _, true)`
 */
function SET(
  o: Object, p: string[],
  v: ConfigVal
): ConfigVal {
  return FIND(o, p, v, true);
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
function FIND(
  obj: any,
  path: string[],
  val?: ConfigVal,
  force: boolean = false
): ConfigVal  {
  // Let's follow the next key
  let key = path.shift();
  const hasKey = Object.hasOwnProperty.call(obj, key);
  if (path.length === 0) {
    // We're at the end of the path
    if (force || !hasKey) {
      // Update the property if either forced or unset.
      obj[key] = val;
    }
    if (obj === process.env) {
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
    } else {
      // Return what's there.
      return obj[key];
    }
  } else {
    // If not set, fill in this position with a new object.
    obj[key] = hasKey ? obj[key] : {};
    // Return `FIND` on the next path part.
    return FIND(obj[key], path, val, force);
  }
}
