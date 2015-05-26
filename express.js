function load(){
  module.exports = require('./src/01_express.coffee');
}

try {
  load();
} catch (e) {
  require('coffee-script/register');
  load();
}
