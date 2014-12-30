var express = require('express');
var proceedings = require('../lib/proceedings.js');

var app = express();

app.get('/proceedings', proceedings.all);
app.get('/proceedings/:name', proceedings.one);

var server = app.listen(8081, function() {
  console.log('%s listening at %s', server.address().address, server.address().port);
});
