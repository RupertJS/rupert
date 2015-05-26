function load(){
  module.exports = require('./src/express.coffee');
}

try {
  load();
} catch (e) {
  require('coffee-script/register');
  load();
}
