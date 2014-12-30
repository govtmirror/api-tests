var mysql = require('mysql2');
var _ = require('lodash');

var test = {
  hapi: (module.parent.filename.substr("hapi/server.js".length * -1) === "hapi/server.js") ? true : false,
  express: (module.parent.filename.substr("express/server.js".length * -1) === "express/server.js") ? true : false,
  restify: (module.parent.filename.substr("restify/server.js".length * -1) === "restify/server.js") ? true : false
};

var connection = mysql.createConnection({
  user: process.env.MYSQL_ENV_MYSQL_USER || 'apitest',
  password: process.env.MYSQL_ENV_MYSQL_PASSWORD || 'apitest',
  database: process.env.MYSQL_ENV_MYSQL_DATABASE || 'apitest',
  port: process.env.MYSQL_PORT_3306_TCP_PORT || 3306,
  host: process.env.MYSQL_PORT_3306_TCP_ADDR || '127.0.0.1'
});

var proceeding_table = process.env.MYSQL_PROCEEDING_TABLE || 'proceedings';

connection.connect(function(err) {
  if (err) {
    console.error(err);
    process.abort();
  }

  console.log('\nMySql connected\n');
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

  connection.query('select * from ' + proceeding_table + ' limit ? offset ?', [options.limit, options.offset], function(err, rows) {

    if (test.hapi) {
      res(rows);
    }

    if (test.express) {
      res.send(rows);
    }

    if (test.restify) {
      res.send(rows);
      return next();
    }
  });
}

exports.one = function(req, res, next) {
  connection.query('select * from ' + proceeding_table + ' where id=?', [req.params.id], function(err, rows) {

    if (test.hapi) {
      res(rows);
    }

    if (test.restify) {
      res.send(rows);
      next();
    }
  });
}
