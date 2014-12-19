var mysql = require('mysql2');
var connection = mysql.createConnection({
  user: 'apitest',
  database: 'apitest'
});

exports.all = function(req, res, next) {
  //TODO limit
  connection.query('select * from proceedings', function(err, rows) {
    res.send(rows);
    next();
  });
}

exports.one = function(req, res, next) {
  connection.query('select * from proceedings where id=?', [req.params.id], function(err, rows) {
    res.send(rows);
    next();
  });
}
