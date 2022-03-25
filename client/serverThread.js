const express = require("express");

const checkAddress = require('./indexxClass.js');
var numCPUs = require('os').cpus().length;
var cluster = require('cluster');

// App setup
const HOST = '127.0.0.1';
const PORT = 3000;
const app = express();
const server = app.listen(PORT,HOST, function () {
  console.log(`Listening on port ${PORT}`);
  console.log(`http://${HOST}:${PORT}`);
});

// Static files
// Socket setup
if (cluster.isMaster) {
    // Fork workers.
    for (var i = 0; i < numCPUs; i++) {
      cluster.fork();
    }
  } else {
    var socket = require("socket.io");
    var RedisStore = socket.RedisStore;
    
    const io = socket(server, {
    cors: {
        origin: '*',
    }
    });
    io.set('store', new socket.RedisStore);
    io.on("connection", function (socket) {
    console.log("Made socket connection");
    
        socket.on('CH01', function (from, msg) {
            console.log('MSG', from, ' saying ', msg);
            socket.join(from);
            checkAddress.initiate(0.001,msg.toString(),12,1,io,socket,from).then(result => {
                console.log(result);
                io.sockets.in(from).emit('Final', result);
                socket.disconnect(true);
            }).catch(error => {
            console.log("Error;",JSON.stringify(error));
            //res.statusMessage = JSON.stringify(error);
            //res.status(400).send(JSON.stringify(error))
            io.sockets.in(from).emit('error', JSON.stringify(error));
            //res.end()
            }) 
        });
        socket.on('end', function (){
            socket.disconnect(0);
        });
        
    });
}