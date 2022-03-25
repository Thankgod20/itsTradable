const express = require("express");
const socket = require("socket.io");
const asyncc = require('async');
const checkAddress = require('./indexxClass.js');

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
const io = socket(server, {
  cors: {
    origin: '*',
  }
});

io.on("connection", function (socket) {
  console.log("Made socket connection");
    const queue = asyncc.queue((param, completed) => {
		socket.join(param.f);
		console.log("Currently Busy Processing Task " + param.f+"FFF"+param.m);
	
		// Simulating a Complex task

		
		new checkAddress().main(0.001,param.m.toString(),12,1,io,socket,param.f).then(result => {
	    	console.log(result);
	    	io.sockets.in(param.f).emit('Final', result);
			socket.disconnect(true);
			const remaining = queue.length();
			completed(null, {param, remaining});
			
	    }).catch(error => {
		  console.log("Error;",JSON.stringify(error));
		  //res.statusMessage = JSON.stringify(error);
		  //res.status(400).send(JSON.stringify(error))
		  io.sockets.in(param.f).emit('error', JSON.stringify(error));
		  const remaining = queue.length();
		  completed(null, {param, remaining});
		  //res.end()
	      }) 
	},1)
	queue.drain = function () {
		console.log('all items have been processed');
	  }
    socket.on('CH01', function (from, msg) {
		console.log('MSG', from, ' saying ', msg);
		
	    queue.push({f:from,m:msg}, (error, {task, remaining}) => {
			if(error){
				console.log(`An error occurred while processing task ${task}`);
			} else {
				console.log(`Finished processing task ${task}
					   . ${remaining} tasks remaining`);
			}
		  });
	});

    socket.on('end', function (){
    	socket.disconnect(0);
    });

});
