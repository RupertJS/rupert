PLUGIN_PREFIX = 'rupert-plugin-'

Path = require 'path'
findup = require 'findup-sync'

module.exports = (config)->
  # quick and dirty check if a dependency is requireable
  canRequire = (key)->
    key.indexOf(PLUGIN_PREFIX) is 0 or key.indexOf('/') > -1

  cfg = config.find 'plugins', findup('package.json')
  if typeof cfg is 'string'
      cfg = require Path.resolve cfg
  deps = cfg.dependencies
  for key of deps when canRequire key
    dependency =
      try
        require(key)
      catch e
        logger.warn "Could not load plugin #{key}"
        logger.info err, err.stack
        (->)
    dependency(config)

module.exports.PREFIX = PLUGIN_PREFIX
