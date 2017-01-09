
var dgram = require('dgram');
var server = dgram.createSocket('udp4');

// Server Port
var PORT = 33333;

// Server IP
var HOST = '127.0.0.1';

// Sets the number for the server from the cmd arg
var offset = 0;

if(process.argv[3]) {
	
	HOST = process.argv[2];
	offset += parseInt(process.argv[3]);

} else if(process.argv[2]) {
	offset += parseInt(process.argv[2]);
	
}

PORT += offset;



var messages = {};
var flooded = {};

// start listening for incoming transmissions
server.on('listening', function () {
	var address = server.address();
	console.log('UDP Server listening on ' + address.address + ":" + address.port);
});

// check incoming messages
server.on('message', function (message, remote) {
	console.log(remote.address + ':' + remote.port +' - ' + message);
	
	if(message.toString("utf-8", 0, 4)==="SEND") {
		messages[message.toString("utf-8", 4, 34)] = message.toString("utf-8", 34, message.length);	
		//flood the message
		if(!flooded[message]) 
			flood(message, remote);
	}

	if(message.toString("utf-8", 0, 3)==="GET") {
		Object.keys(messages).forEach(function(key,index) {
			// If the server has the message, send it to client
			if(message.toString("utf-8", 3, 14)===key.substring(20, 31)) {
				var msg = new Buffer(key + messages[key]);
				server.send(msg, 0, msg.length, remote.port, remote.address ); 
			}
		});
	}

	if(message.toString("utf-8", 0, 3)==="ACK") {
		delete messages[message.toString("utf-8", 3, 33)];
		// flood messages we have not successfuly recieved ACK for
		if(!flooded[message]) 
			flood(message, remote);
	}
});

// Send message to the remote addresses on port+-1
function flood(message, remote) {
	server.send(message, 0, message.length, parseInt(PORT)+1, remote.address );
	server.send(message, 0, message.length, parseInt(PORT)-1, remote.address );
	console.log("flooding: " + message);
	flooded[message] = true;
}

server.bind(PORT, HOST);