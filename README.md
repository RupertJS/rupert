# Rupert


Your friendly neighborhood node application watcher. [rupert](#) handles every piece of programming at the front edge, letting teams and developers quickly and efficiently write business code for browser clients and their backing HTTP APIs.

<img src="https://cdn.rawgit.com/DavidSouther/rupert/master/src/assets/logos/Rupert.svg" type="image/svg+xml" width="400px" />

When a developer today first comes across front-edge programming, it's daunting the number of technologies you need to know to build an application. From the bottom up, you have `docker`, `node`, `npm`, `grunt`, `mocha`, `karma`, `chai`, `express`, `mongo`, `mongoose`, `passport`, `oauth`, `cucumber`, `angular`, `protractor`, `bootstrap`, `firebase` and probably a couple I'm forgetting.  Rupert's ideal is consolidating, well, all of these, into a single library. That library knows all the configurations, and all the little tips and tricks. It is configurable & extensible, with a well-documented API; it has a cookbook, which guides a new developer through the process while serving as a handy reference and reminder for a veteran developer. I haven't seen a product or solution that brings those together into one unified whole for the Node stack, like Rails did and does.

## Getting Started

1. Create a new project.
  1. On Github, set the name and description. Generate a Readme and license.
1. Clone the project from GitHub.
1. Initialize the project and install dependencies:
  * `npm init`
  * `npm install  --save rupert`
  * `npm install --save-dev grunt grunt-cli rupert-grunt`
    * While npm is smart in initialization, you can set a name, etc in your [npmrc][npmrc]
1. Choose your frontend toolkit.
  * **Angular & Bootstrap** `npm install --save rupert-config-angular rupert-config-bootstrap`
  * **Ionic** (includes angular) `npm install --save rupert-config-ionic`
1. Run `cp -a node_modules/rupert-grunt/plain/*  ./` (See [the source directory here][plain_folder]).
  1. Edit the `title` in `./src/client/index.jade`
  1. Edit the `ng-app` module name in `./src/client/index.jade`
  1. Change the module name in `./src/client/main.js` to match.
1. (Optional) Add npm scripts to your `package.json`:
  1. `"start": "node ./app.js"`
  1. `"test": "./node_modules/.bin/grunt"`

[plain_folder]: https://github.com/DavidSouther/rupert-grunt/tree/master/plain
[npmrc]: https://www.npmjs.org/doc/misc/npm-config.html#config-settings

## Commands

**`$ node app.js`** Starts the application. Will print the root url path to the command line. Serves the API routes, as well as compiled client source folders. A livereload server is available, that triggers on css/js/template changes.

**`$ grunt`** Lints the code, and runs unit tests on the client and server.

* **`$ grunt watcher`** A watcher for the same.

**`$ grunt features`** Runs any Behavior Features tests; first runs a pass of [features tagged][tagging] `@current`, then runs any *not* tagged `@broken`.

[tagging]: https://github.com/cucumber/cucumber/wiki/Tags

## Layout

With no additional configuration, Rupert expects a [modular layout](https://github.com/RupertJS/rupert/wiki/Project-Layout).

## Whirlwind Tutorial

You should probably skip the Project Layout documentation, and skip [straight to an example](https://github.com/RupertJS/rupert/wiki/Whirlwind-Tutorial).

## Cookbook

Some recipes are available:

* [Q: How do I add libraries to the compiled vendors.(js|css) files?](https://github.com/RupertJS/rupert/wiki/Cookbook:-Add-Vendor-Libraries)

## Docs

The full documentation on settings in `server.json` is [in the wiki](https://github.com/RupertJS/rupert/wiki/Config-API).

## Changelog

* **0.2.5** *2014-11-03* Improved algo for determining loadable stassets configs.'
* **0.2.4** *2014-11-03* Travis integration and testing.
* **0.2.3** *2014-10-24* Handle configuring and serving static assets.
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
