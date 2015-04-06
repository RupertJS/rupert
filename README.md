# Rupert

Your friendly full stack Javascript librarian. [Rupert](#) handles every piece of programming at the front edge, letting teams and developers quickly and efficiently write business code for browser clients and their backing HTTP APIs.

<img src="https://cdn.rawgit.com/DavidSouther/rupert/master/src/assets/logos/Rupert.svg" type="image/svg+xml" width="400px" />

When a programmer today first comes across full-stack javascript development, it's daunting the number of technologies and libraries needed to build an application. From the bottom up, you likely have `docker`, `node`, `npm`, `grunt`, `mocha`, `karma`, `chai`, `express`, `mongo`, `mongoose`, `passport`, `oauth`, `cucumber`, `angular`, `protractor`, `bootstrap`, `firebase` and plugins for all of those.  Rupert consolidates all of these into a single library. Rupert knows all the configurations, and all the little tips and tricks. It is configurable & extensible, with a well-documented API. Rupert is the go-to microservices stack, like Rails formalized the three-tier architecture.

## Front Edge



## Getting Started

1. Create a new project.
  1. On Github, set the name and description. Generate a Readme and license.
  1. Clone the project from GitHub.
1. Unpack the seed app.
  1. From the command line, `cd` into the project folder and execute these three commands.
  1. `curl https://raw.githubusercontent.com/RupertJS/rupert-grunt/master/dist/bare.tgz | tar x`
    * or download and extract manually (files are in the root of the package, be warned) ([tar](https://raw.githubusercontent.com/RupertJS/rupert-grunt/master/dist/bare.tgz)) ([zip](https://raw.githubusercontent.com/RupertJS/rupert-grunt/master/dist/bare.zip)).
    * See [the source directory here][plain_folder].
  2. `npm init`
    * You will be prompted for a project name, license, and a few others.
    * While npm is smart in initialization, you can set most defaults in your [npmrc][npmrc] if you create packages often.
  3 `npm install`
1. Choose your frontend toolkit.
  * **Angular & Bootstrap** `npm install --save rupert-plugin-angular rupert-plugin-bootstrap`
  * **Ionic** (includes angular) `npm install --save rupert-plugin-ionic`
  1. The default Angular package name is `rupert-app`, in `./src/client/index.jade`, `./src/client/main.js`, and other places. Edit this as needed.
  1. *(Coming Soon)* `npm run rename <NEW NAME>` to change all instances of the root module name.

[plain_folder]: https://github.com/DavidSouther/rupert-grunt/tree/master/plain
[npmrc]: https://www.npmjs.org/doc/misc/npm-config.html#config-settings

## Commands

**`$ node app.js`, `$ npm start`** Starts the application. Will print the root url path to the command line. Serves the API routes, as well as compiled client source folders. A livereload server is available, that triggers on changes to any client files (templates, scripts, and styles).

**`$ grunt`, `$ npm test`** Lints the code, and runs unit tests on the client and server.

* **`$ grunt watcher`** A watcher for the same.

**`$ grunt features`, `$ npm run features`** Runs any Behavior Features tests; first runs a pass of [features tagged][tagging] `@current`, then runs any *not* tagged `@broken`.

[tagging]: https://github.com/cucumber/cucumber/wiki/Tags

## Layout

With no additional configuration, Rupert expects a [modular layout](https://github.com/RupertJS/rupert/wiki/Project-Layout).

## Whirlwind Tutorial

You should probably skip the Project Layout documentation, and go [straight to an example](https://github.com/RupertJS/rupert/wiki/Whirlwind-Tutorial).

## Cookbook

Some recipes are available:

* [Q: How do I add libraries to the compiled vendors.js and vendors.css files?](https://github.com/RupertJS/rupert/wiki/Cookbook:-Add-Vendor-Libraries)
* [Q: How do I configure Rupert's logging settings?](https://github.com/RupertJS/rupert/wiki/Cookbook:-Configure-Logging)
* [Q: How do I make use of templates in Rupert?](https://github.com/RupertJS/rupert/wiki/Cookbook:-Using-Templates)
* [Q: How do I create a Rupert plugin?](https://github.com/RupertJS/rupert/wiki/Cookbook:-Creating-a-Rupert-Plugin)

## Docs

The full documentation on settings in `server.json` is [in the wiki](https://github.com/RupertJS/rupert/wiki/Config-API).

## Changelog

* **0.3.1** *2015-01-09* Major refactor of config mechanism. Userland unaffected, but `rupert-plugin` projects need migration.
* **0.2.7** *2014-12-30* Expose Stassets watcher constructors.
* **0.2.6** *2014-12-11* New logging configs, small stability improvements.
* **0.2.5** *2014-11-03* Improved algo for determining loadable stassets configs.
* **0.2.4** *2014-11-03* Travis integration and testing.
* **0.2.3** *2014-10-24* Handle configuring and serving static assets.
* **0.2.0** *2014-10-16* Moving to rupert-config-* for alternative configs.
* **0.1.2** *2014-10-10* Server starts asyncly, generates certs dynamically.
* **0.1.0** *2014-10-09* Renamed to Rupert.
* **0.0.14** *20214-09-26* Bin script to generate cert. Env overrides config.
* **0.0.13** *2014-09-17* Loads hostname from platform or config.
* **0.0.0 - 0.0.11** *2014-09-11* Initial work; lots of iterative tweaks.

[ng]: https://angularjs.org/
[stas]: https://github.com/DavidSouther/stassets
[moment]: http://momentjs.com/
