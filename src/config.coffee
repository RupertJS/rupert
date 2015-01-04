###
Convenience for `FIND(_, _, _, true)`
###
SET = (o, p, v)-> FIND o, p, v, yes

###
Utility method to recursively look through an object and return a node. Creates
missing nodes along the way. Sets the found node with a value if not present, or
if told to force updating.

@param obj {Object} to search in.
@param path {Array<string>|string} path to follow in the object tree. If a
        string, nodes should be dot-separated.
@param val {Any} default value to set the found property to if undefined or if
        `force` is `true`.
@param force {boolean} if `true`, replace the value even if it is set.
###
FIND = (obj, path, val, force = no)->
  if typeof path is 'string'
    # Redo the FIND, after expanding the path to an array.
    FIND obj, path.split('.'), val, force
  else
    # Somehow got to an error state.
    if path.length is 0
      throw new Error 'Key Not Found'
    # Let's follow the next key
    key = path.shift()
    if path.length is 0
      # We're at the end of the path
      # Update the property if either forced, or undefined.
      obj[key] = val if force or not obj[key]?
      # Return what's there.
      obj[key]
    else
      # If undefined, fill in this position with a new object.
      # Return `FIND` on the next path part.
      FIND obj[key] or= {}, path, val, force


###
Class to manage a configuration object. Configurations are filled in with a bare
object to begin, and when properties are accessed either set and use a default
value, return the current value, or can be forced to update with an environment
override or a setter fn.

In vanilla JS, the Config object replaces code like

```
config.prop = process.env.PROP || config.prop || 'value';
```

with

```
config.find('prop', 'PROP', 'value');
```

Also provides convenience utilities for working with lists as values.

###
class Configuration
  ###
  @param options {Object} initial values.
  ###
  constructor: (options)->
    @[key] = val for own key, val of options
    @options = @ # TODO Remove this when all uses of `config.prop` are excised.
  ###
  Force `key` to be `value`
  ###
  set: (key, value)->
    SET @options, key, value
  ###
  Look up `key` in this config, setting to `deflt` if not set. If `env` is
  supplied and a property on `process.env`, override `key` with that value.
  Return the found or set value.
  ###
  find: (key, env, deflt)->
    if arguments.length is 2
      deflt = env
      env = null
    if env
      value = FIND process.env, env, deflt
      SET @options, key, value or deflt
    else
      FIND @options, key, deflt
  ###
  Apply `fn` to every entry at `key`, if `key` finds an array, or apply `fn` to
  the value if `value` is not an array. Useful for EG normalizing an array of
  configured paths.

  ```
  config.map('paths', function(_){return Path.resolve(__dirname, _);});
  ```
  ###
  map: (key, fn)->
    list = FIND @options, key, []
    if list instanceof Array
      list = list.map fn
    else
      list = fn list
    SET @, key, list
  ###
  Append the values in `arr` to the list at `key`. Coerces both `arr` and the
  value to `[arr]` if not already an array.
  ###
  append: (key, arr)->
    arr = [arr] unless arr instanceof Array
    list = FIND @options, key, []
    # Coerce list to array
    list = [list] unless list instanceof Array
    list = list.concat arr
    SET @options, key, list
  ###
  Prepend the values in `arr` to the list at `key`. Coerces both `arr` and the
  value to `[arr]` if not already an array.
  ###
  prepend: (key, arr)->
    arr = [arr] unless arr instanceof Array
    list = FIND @options, key, []
    list = [list] unless list instanceof Array
    list = arr.concat list
    SET @options, key, list

module.exports = Configuration
