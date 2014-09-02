# Angular Stassets Servers

A collection of base servers for [angular][ng] and [stassets][stas] projects.

## Example Usage

**`package.json`**
```json
{
  "name": "ng-stassets-test",
  "version": "0.0.0",
  "description": "",
  "main": "app.js",
  "dependencies": {
    "ng-stassets": "^0.0.0"
  },
  "author": "David Souther <davidsouther@gmail.com>",
  "license": "ISC",
  "stassets": {
    "verbose": true,
    "root": "./src/client"
  },
  "routing": [
    "./src/server/**/route.coffee"
  ]
}
```

**`app.js`**
```javascript
global.root = __dirname;
require('ng-stassets/express')(require('./package')).start()
```

**`src/client/index.jade`**
```jade
doctype
html
    head
        title Hello, ng-stassets-test!
    body
        h1 Hi there!
```

**`src/server/hello/route.coffee`**
```coffeescript
winston = require('ng-stassets/src/logger').log
module.exports = (config, app)->
    app.get '/hello', (q, s, n)->
        s.send "Hello from #{config.name}"
    winston.silly 'Attaching /hello'
```

[ng]: https://angularjs.org/
[stas]: https://github.com/DavidSouther/stassets
