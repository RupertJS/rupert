/// <reference path="../typings/node/node.d.ts" />

export class Config {
  private _data: any = {};
  constructor(options: any = {}) {
    for (let key in options) {
      if (options.hasOwnProperty(key)) {
        this._data[key] = options[key];
      }
    }
  }

  set(key: string, value: any) {
    return SET(this._data, key.split('.'), value);
  }

  find(key: string, deflt?: any): any {
    return FIND(this._data, key.split('.'), deflt);
  }
}

/**
 * Convenience for `FIND(_, _, _, true)`
 */
function SET(o: Object, p: string[], v: any) {
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
function FIND(obj: any, path: string[], val?: any, force: boolean = false): any
{
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
