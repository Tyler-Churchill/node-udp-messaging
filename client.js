// The clients port
var PORT = 33333;
// The clients IP address
var HOST = '127.0.0.1';

// choose which server to connect with
if(process.argv[3]) {
	HOST = process.argv[2];
	PORT += parseInt(process.argv[3]);

} else if(process.argv[2]) {
	PORT += parseInt(process.argv[2]);
}

var dgram = require('dgram');

var id = "";
var friendId = "";
var count = 0;

var client = dgram.createSocket('udp4');

// Colors allows for different colored text inside the terminal
var colors = require('colors');
var getMsg = new Buffer("GET");


client.on('listening', function () {
    var address = client.address();
    console.log('UDP Client listening on ' + address.address + ":" + address.port);
});

client.on('message', function (message, remote) {

    console.log(message.toString("utf-8", 30, message.length).green);

    var ackMsg = new Buffer("ACK" + message.toString("utf-8", 0, 30));
	client.send(ackMsg, 0, ackMsg.length, PORT, HOST, function(err, bytes) { if (err) throw err; });

});

//init Id to port
var initMsg = new Buffer("INIT");
client.send(initMsg, 0, initMsg.length, PORT, HOST, function(err, bytes) {
	 if (err) throw err; 
	 getId();
});


// gets the clients id from the user input
function getId() {
	prompt("id: ", function (result) {
	    id = result;
		getMsg = new Buffer("GET" + lpad(id));
	    getFriendId();
	 });
};

// gets the clients chosen friendID
function getFriendId() {
	prompt("Friend Id: ", function (result) {
	    friendId = result;
	    getMessage();

	    // poll incoming messages every second
		setInterval(function() {client.send(getMsg, 0, getMsg.length, PORT, HOST, function(err, bytes) { if (err) throw err; }); }, 1000);
	});
};

// get user input and send it
function getMessage() {
	prompt("", function (result) {
	    if(sendMessage(result))
	    	getMessage();
	});
};


// construct a packet and then send it
function sendMessage(txt) {
	// Exit when user types exit
	if(txt==='exit'){
		client.close();
		process.exit();
	}
	// construct the message
	var message = new Buffer("SEND" + lpad(count++) + lpad(id) + lpad(friendId) + txt);

	// send message
	client.send(message, 0, message.length, PORT, HOST, function(err, bytes) {
		if (err) throw err;
	});
	return true;
};

function onErr(err) {
    console.log(err);
    return 1;
}

// get the users input
function prompt(question, callback) {
    var stdin = process.stdin,
        stdout = process.stdout;

    stdin.resume();
    stdout.write(question);

    stdin.once('data', function (data) {
        callback(data.toString().trim());
    });
}

// padding for creating packet
function lpad(num) {
	var str = "" + num;
	var pad = "0000000000";
	var ans = pad.substring(0, pad.length - str.length) + str;
	return ans;
}

