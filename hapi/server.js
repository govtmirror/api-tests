var Hapi = require('hapi');
var proceedings = require('../lib/proceedings.js');

// Create a server with a host and port
var server = new Hapi.Server();
server.connection({
  host: '0.0.0.0',
  port: 8081
});

server.route({ method: 'GET', path: '/proceedings', handler: proceedings.all });
server.route({ method: 'GET', path: '/proceedings/{name}', handler: proceedings.one });

process.on('uncaughtException', function (err) {
    console.log(err);
});

// Start the server
server.start(function () {
    console.log('Server running at:', server.info.uri);
});
