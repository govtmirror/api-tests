var restify = require('restify');
var proceedings = require('../lib/proceedings.js');

var server = restify.createServer();
server.use(restify.queryParser());

server.get('/proceedings', proceedings.all);
server.get('/proceedings/:name', proceedings.one);

server.listen(8080, function() {
  console.log('%s listening at %s', server.name, server.url);
});
