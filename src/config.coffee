SET = (o, p, v)-> FIND o, p, v, yes
FIND = (obj, path, val, force = no)->
  if typeof path is 'string'
    FIND obj, path.split('.'), val, force
  else
    if path.length is 0
      throw new Error 'Key Not Found'
    key = path.shift()
    if path.length is 0
      obj[key] = val if force or not obj[key]?
      obj[key]
    else
      FIND obj[key] or= {}, path, val, force

class Configuration
  constructor: (@options)->
    @[key] = val for own key, val of @options
  set: (key, value)->
    SET @, key, value
  find: (key, env, deflt)->
    if arguments.length is 2
      deflt = env
      env = null
    if env
      value = FIND process.env, env, deflt
      SET @, key, value or deflt
    else
      FIND @, key, deflt
  map: (key, fn)->
    list = FIND @, key, []
    if list instanceof Array
      list = list.map fn
    else
      list = fn list
    SET @, key, list
  append: (key, arr)->
    arr = [arr] unless arr instanceof Array
    list = FIND @, key, []
    # Coerce list to array
    list = [list] unless list instanceof Array
    list = list.concat arr
    SET @, key, list
  prepend: (key, arr)->
    arr = [arr] unless arr instanceof Array
    list = FIND @, key, []
    list = [list] unless list instanceof Array
    list = arr.concat list
    SET @, key, list

module.exports = Configuration
