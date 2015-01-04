Path = require 'path'
findup = require 'findup-sync'

module.exports = (config)->
  # quick and dirty check if a dependency is requireable
  canRequire = (key)->
    key.indexOf('rupert-config-') is 0 or key.indexOf('/') > -1

  cfg = config.find 'plugins', findup('package.json')
  if typeof cfg is 'string'
      cfg = require Path.resolve cfg
  console.log "Config is"
  console.log cfg
  deps = cfg.dependencies
  for key of deps when canRequire key
    dependency =
      try
        require(key)
      catch e
        # # We might be in an awkward position. Given a common known
        # # path we can assume the module that loaded rupert is at:
        # base = module.parent.parent.parent.parent.parent.filename
        # # try
        #   require(Path.join(
        #     Path.dirname(base), 'node_modules', key
        #   ))
        # catch err
        #   logger.warn "Could not find config #{key}"
        #   logger.info err, err.stack
        (->)
    dependency(config)
