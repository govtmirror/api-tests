var restify = require('restify');
var mysql   = require('mysql2');
var proceedings = require('./proceedings.js');

var server = restify.createServer();
server.get('/proceedings', proceedings.all);
server.get('/proceedings/:name', proceedings.one);

server.listen(8080, function() {
    console.log('%s listening at %s', server.name, server.url);
});
