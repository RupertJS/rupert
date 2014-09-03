Path = require 'path'

module.exports = (config)->
    prefix: [
        Path.resolve __dirname, '../../../node_modules'
    ].concat(config.prefix or [])
    js: [
        'ionic/release/js/ionic.bundle.js'
        'angular-builds/angular-cookies.min.js'
        # 'jquery/dist/jquery.js'
        # 'angular-grid/ng-grid-2.0.11.debug.js'
        # 'angular-ui/build/**/*'
        # 'bootstrap/dist/js/bootstrap.js'
        # 'angular-bootstrap/ui-bootstrap-tpl.js'
        # 'angular-bootstrap/ui-bootstrap.js'
    ].concat(config.js or [])

    css: [
        # 'bootstrap/dist/css/bootstrap.css'
        # 'bootstrap/dist/css/bootstrap-theme.css'
        # 'bootstrop/dist/fonts/*.css'
        # 'css-social-buttons/css/*.css'
        'ionic/release/css/ionic.css'
    ].concat(config.css or [])
