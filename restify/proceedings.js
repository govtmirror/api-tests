var mysql = require('mysql2');
var _     = require('lodash');

var connection = mysql.createConnection({
  user: 'apitest',
  database: 'apitest'
});

function sanitizeOptions(options) {
  var defaults = {
    offset: 0,
    limit: 100
  };

  options = _.defaults(options, defaults);

  if(options.limit > 100) {
    options.limit = 100;
  }

  return options;
}

exports.all = function(req, res, next) {

  var options = {
    offset: req.params.offset,
    limit: req.params.limit
  };

  options = sanitizeOptions(options);

  //console.log(options.limit);

  connection.query('select * from proceedings limit ? offset ?', [options.limit, options.offset], function(err, rows) {
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
