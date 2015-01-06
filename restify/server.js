var restify = require('restify');
var proceedings = require('../lib/proceedings.js');

var server = restify.createServer();
server.use(restify.queryParser());

server.use(restify.acceptParser(server.acceptable));
server.use(restify.authorizationParser());
server.use(restify.dateParser());
server.use(restify.urlEncodedBodyParser());

server.get('/proceedings', proceedings.all);
server.get('/proceedings/:name', proceedings.one);

server.listen(8081, function() {
  console.log('%s listening at %s', server.name, server.url);
});
