const express = require("express");
const socket = require("socket.io");
const checkAddress = require('./indexxUnn.js');
const greenlock = require('greenlock-express');
const options = require('./greenlock-options.js');

// App setup
const HOST = '127.0.0.1';
const PORT = 3000;

const app = require('express')().use('/', function (req, res) {
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.end('Hello, World!\n\n💚 🔒.js');
});
// Static files
let server = greenlock.create(options).listen(80, 443);
// Socket setup
const io = socket(server, {
  cors: {
    origin: '*',
  }
});

io.on("connection", function (socket) {
  console.log("Made socket connection");
  
    socket.on('CH01', function (from, msg) {
	    console.log('MSG', from, ' saying ', msg);
	    /**
	    checkAddress.initiate(0.001,msg.toString(),12,1,io,socket).then(result => {
	    	console.log(result);
	    	io.to(socket.id).emit('Final', result);
	    	socket.disconnect(true);
	    }).catch(error => {
		  console.log("Error;",JSON.stringify(error));
		  //res.statusMessage = JSON.stringify(error);
		  //res.status(400).send(JSON.stringify(error))
		  io.to(socket.id).emit('error', JSON.stringify(error));
		  //res.end()
	      }) */
    });
    socket.on('end', function (){
    	socket.disconnect(0);
    });
    
});
