module.exports = (config)->
    prefix: Path.expand '../../../node_modules'
    js: [
        'angular-builds/angular.min.js'
        'angular-ui-router/release/angular-ui-router.js'
        'angular-builds/angular-cookies.min.js'
        'angular-builds/angular-resource.min.js'
        'angular-builds/angular-sanitize.min.js'
        'angular-builds/angular-animate.min.js'
        # 'jquery/dist/jquery.js'
        # 'angular-grid/ng-grid-2.0.11.debug.js'
        # 'angular-ui/build/**/*'
        'bootstrap/dist/js/bootstrap.js'
        'angular-bootstrap/ui-bootstrap-tpl.js'
        'angular-bootstrap/ui-bootstrap.js'
    ].concat(config.js or [])

    css: [
        'bootstrap/dist/css/bootstrap.css'
        'bootstrap/dist/css/bootstrap-theme.css'
        'bootstrop/dist/fonts/*.css'
        # 'css-social-buttons/css/*.css'
        'ionic/release/css/ionic.css'
    ].concat(config.css or [])
