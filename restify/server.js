var restify = require('restify');
var mysql   = require('mysql2');

var connection = mysql.createConnection({
  user: 'apitest',
  database: 'apitest'
});

function respond(req, res, next) {
  connection.query('select * from proceedings', function(err, rows) {
    res.send(rows);
    next();
  });
}

var server = restify.createServer();
server.get('/proceedings', respond);
server.get('/proceedings/:name', respond);

server.listen(8080, function() {
    console.log('%s listening at %s', server.name, server.url);
});
