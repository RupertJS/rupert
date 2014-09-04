Path = require 'path'

module.exports = (config)->
    prefix: [
        Path.resolve __dirname, '../../../node_modules'
    ].concat(config.prefix or [])
    js: [
        'angular-builds/angular.js'
        'angular-ui-router/release/angular-ui-router.js'
        'angular-builds/angular-cookies.min.js'
        'angular-builds/angular-resource.min.js'
        'angular-builds/angular-sanitize.min.js'
        'angular-builds/angular-animate.min.js'
    ].concat(config.js or [])

    css: [
    ].concat(config.css or [])
