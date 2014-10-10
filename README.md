# Angular Stassets Servers

You are wasting time on build steps. This server is always up to date, and
flexible enough to meet any javascript project's needs.

[rupert](#) is a collection of base servers for [angular][ng] and
[stassets][stas] projects.

Use this package to create and configure an Express server that manages static
files and configures API endpoints.

## Example Usage

Add some configuration options to `package.json`.

**`package.json`**
```json
{
  "name": "rupert-test",
  "version": "0.0.0",
  "description": "",
  "main": "app.js",
  "scripts": {
    "start": "node app.js"
  },
  "dependencies": {
    "ng-stassets": "^0.0.0",
    "debug": "^2.0.0"
  },
  "author": "David Souther <davidsouther@gmail.com>",
  "license": "ISC",
  "stassets": {
    "root": "./src/client"
  },
  "routing": [
    "./src/server/**/route.coffee"
  ]
}
```

Set the `global.root` to understand file paths, pass `package.json` to the
`ng-stassets` server of your choice, and call `start` on the server reference
you get back.

**`app.js`**
```javascript
global.root = __dirname;
require('rupert')(require('./package')).start()
```

By default, `stassets` looks for a component-based project architecture,
compiling Jade, Coffee, Javascript, Stylus, and CSS. See `[stassets][stas]` for
more details.

**`src/client/index.jade`**
```jade
doctype
html
    head
        title Hello, ng-stassets-test!
    body
        h1 Hi there!
```

Define API routes. Any files matching the pattern in the `routing` URL will be
`require`d, expecting a function that takes a reference to an Express `app` and
the `config` passed to the root `ng-stassets` load, in this case the entire
`package.json`.

**`src/server/hello/route.coffee`**
```coffeescript
debug = require('debug')('rupert-test:help')
module.exports = (app, config)->
    app.get '/hello', (q, s, n)->
        s.send "Hello from #{config.name}"
    debug 'Attaching /hello'
```

## Recognized Options

These options can be passed as an object to `ng-stassets`, though best practice
for servers is to place them in `package.json`.

### `name`

Required. The name for the app.

### `hostname`

Optional. The hostname to server on. Will use `HOST` from the environment, or
`os.hostname()` as a default.

### `port`

Optional. Integer port to listen on. Defaults to 8080.

### `stassets`

Optional. A configuration for the underlying `stassets` compiler. If `false`,
completely disables `stassets`. For more information, see the [`stassets`
docs][stas].

#### `stassets.root`

Required. The root directory for `stassets` client files, relative to
`global.root` specified in the root js file. If an array, specifies the root
directories for a cascading file system.

#### `stassets.framework`

Optional. One of `"none"`, `"ionic"`, or `"bootstrap"`. `"none"` loads vanilla
Angular. `"ionic"` loads Angular with Ionic styles, components, and themes.
`"bootstrap"` does the same. *In fact, this preconfigures the `vendors` key.*
Defaults to `"ionic"`.

#### `stassets.vendors`

Optional. Additional vendor root directories and files.

### `routing`

Optional. Array of glob paths. Any file matching that glob will be loaded and
called as a function taking `app`, a reference to the application server, and
`config`, a reference to this configuration object.

### `tls`

Optional. If present, will configure the server to use SSL encryption for all
connections. If `true`, will load TLS using default values.

#### `tls.port`

Optional. Port for HTTPS to listen on. Defaults to 8443.

#### `tls.key`

Optional. Path to server private key. Defaults to
`"#{global.root}/env/server.key"`.

#### `tls.cert`

Optional. Path to server public certificate. Defaults to
`"#{global.root}/env/server.crt"`.

## Cookbook

### Q: How do I add libraries to the compiled `vendors.(js|css)` files?

Additional libraries can be added to a project using any dependency mechanism,
then added to the `vendors` key in the `stassets` configuration. For instance,
let's add [Moment.js][moment] for date handling.

1. Install the dependency: `$ npm install --save moment`
1. Add a `vendors` section to the `stassets` config

        "stassets": {
            "vendors": {
                "prefix": ["./node_modules"],
                "js": ["moment/min/moment.min.js"]
            }
        }

1. Use moment through the global `moment` variable. (In an angular project, the
    recommended best practice is to wrap that variable in a service.)


* The `prefix` key is an array of directories to look in. For instance, when
    mixing both `node_modules` and `bower` dependencies, the `prefix` key could
    be `[ "./node_modules", "./components" ]`
* The `js` and `css` keys are arrays of files to concatenate in their respective
    `vendors.js` and `vendors.css` files. The `prefix` directories will be
    searched in order for these paths, and the first match will be returned.

### How do I run tests?



## Changelog

* **0.1.0** *2014-10-09* Renamed to Rupert.
* **0.0.14** *20214-09-26* Bin script to generate cert. Env overrides config.
* **0.0.13** *2014-09-17* Loads hostname from platform or config.
* **0.0.0 - 0.0.11** *2014-09-11* Initial work; lots of iterative tweaks.

## Roadmap

* **Hapi.js** integration. Allow choosing Hapi or Express frameworks.

[ng]: https://angularjs.org/
[stas]: https://github.com/DavidSouther/stassets
[moment]: http://momentjs.com/
