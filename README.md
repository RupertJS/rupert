# Rupert


Your friendly neighborhood node application watcher. [rupert](#) is a server and default configuration for [angular][ng] and [stassets][stas] projects.

![Rupert](src/assets/logos/Rupert.svg)


## Getting Started

1. Create a new project.
  1. On Github, set the name and description. Generate a Readme and license.
1. Clone the project from GitHub.
1. Run `npm init ; npm i --save rupert ; npm i --save-dev grunt grunt-cli rupert-grunt`.
  * While npm is smart in initialization, you can set a name, etc in your [npmrc][npmrc]
1. Choose your frontend toolkit, either Angular+Bootstrap or Ionic. Install with `npm install --save rupert-config-angular-bootstrap` or `npm install --save rupert-config-ionic`. 
1. Run `cp -a node_modules/rupert-grunt/plain/*  ./` (See [the source directory here][plain_folder]).
  1. Edit the `name` field in `./server.json`.
  2. Edit the `title` in `./src/client/index.jade`
  3. Edit the `ng-app` module name in `./src/client/index.jade`
  4. Create a new file, `./src/client/main.js`. In this file, create an angular module with the same name as the ng-app.
1. (Optional) Add npm scripts to your `package.json`:
  1. `"start": "node ./app.js"`
  1. `"test": "./node_modules/.bin/grunt"`


## Recognized Options

These options can be passed as an object to `rupert`, though best practice
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

* **0.2.0** *2014-10-16* Moving to rupert-config-* for alternative configs.
* **0.1.2** *2014-10-10* Server starts asyncly, generates certs dynamically.
* **0.1.0** *2014-10-09* Renamed to Rupert.
* **0.0.14** *20214-09-26* Bin script to generate cert. Env overrides config.
* **0.0.13** *2014-09-17* Loads hostname from platform or config.
* **0.0.0 - 0.0.11** *2014-09-11* Initial work; lots of iterative tweaks.

## Roadmap

* **Hapi.js** integration. Allow choosing Hapi or Express frameworks.

[ng]: https://angularjs.org/
[stas]: https://github.com/DavidSouther/stassets
[moment]: http://momentjs.com/
