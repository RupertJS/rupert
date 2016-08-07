var rupert = require('rupert');

function SampleServer(application) {
  application.logger.info('I have an injected app!');

  this.handlers = [{
    route: '/sample',
    methods: [rupert.Methods.GET],
    handler: this.woot.bind(this)
  }];
}
SampleServer[rupert.$injectionKey] = [rupert.Rupert];

SampleServer.prototype = Object.create({
  woot: function(q, s) {
    s.send('Woot!');
  }
})

var server = rupert.Rupert.createApp({log: {level: 'silly'}}, [
  rupert.Plugins.Healthz,
  SampleServer
]);

server.start();
