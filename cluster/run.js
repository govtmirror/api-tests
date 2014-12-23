'user strict';

var cluster = require('cluster');
var http = require('http');
var numCPUs = require('os').cpus().length;
var path = require('path');

var module = path.resolve('../' + process.argv[2] + '/server.js');
console.log('PATH',module);

if (!require.resolve(module)) {
  console.log('Module ', module, ' does not exist!');
  process.abort();
}
cluster.setupMaster({
  exec: path.resolve(module)
});

if (cluster.isMaster) {
  // Fork workers.
  for (var i = 0; i < numCPUs; i++) {
    console.log("master: about to fork a worker");
    cluster.fork();
  }

  cluster.on('fork', function(worker) {
    console.log('master: fork event (worker ' + worker.id + ')');
  });

  cluster.on('online', function(worker) {
    console.log('master: online event (worker ' + worker.id + ')');
  });

  cluster.on('listening', function(worker, address) {
    console.log('master: fork event (worker ' + worker.id + ' pid ' + worker.process.pid + ',' + address.address + ':' + address.port + ')');
  });

  cluster.on('exit', function(worker, code, signal) {
    console.log('master: exit event (worker ' + worker.id + ' pid ' + worker.process.pid + ')');
  });

} else if (cluster.isWorker) {

  /*
   * Worker handlers
   * stop signals
   */
  process
    .on('message', function(msg) {
      console.log('disconnecting', msg);
      if (msg === 'stop') {
        process.send("stopped");
        process.exit();
      }
    })
    .on("uncaughtException", function(error) {
      if (error.toString() !== 'Error: IPC channel is already disconnected') {
        process.stderr.write(error.stack);
        process.exit(1);
      }
    });

  /*
   * module should have
   * command line argument
   * example: $ node cluster restify
   */

  /*
      if (process.argv[2]) {
        var module = '../' + process.argv[2] + '/server.js';
        if (require.resolve(module)) {
          console.log('processing...', process.argv[2]);
          require(module);
        }
      } else {
        /*
         * Kill worker if module does
         * not exist
         */
  /*
   *    console.log('worker: disconnecting (id=' + cluster.worker.id + ')');
        if (cluster.worker.process.pid)
          cluster.worker.disconnect();
        }
   */
}
