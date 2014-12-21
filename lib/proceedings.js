var mysql = require('mysql2');
var _ = require('lodash');

var test = {
  hapi: (module.parent.filename.substr("hapi/server.js".length * -1) === "hapi/server.js") ? true : false,
  restify: (module.parent.filename.substr("restify/server.js".length * -1) === "restify/server.js") ? true : false
};

var connection = mysql.createConnection({
  user: 'apitest',
  database: 'apitest',
  port: 3306
});

function sanitizeOptions(options) {
  var defaults = {
    offset: 0,
    limit: 100
  };

  options = _.defaults(options, defaults);

  if (options.limit > 100) {
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

  connection.query('select * from proceedings limit ? offset ?', [options.limit, options.offset], function(err, rows) {

    if (test.hapi) {
      res(rows);
    }

    if (test.restify) {
      res.send(rows);
      return next();
    }
  });
}

exports.one = function(req, res, next) {
  connection.query('select * from proceedings where id=?', [req.params.id], function(err, rows) {

    if (test.hapi) {
      res(rows);
    }

    if (test.restify) {
      res.send(rows);
      next();
    }
  });
}
