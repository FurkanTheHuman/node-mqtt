var aedes = require('aedes')()
var server = require('net').createServer(aedes.handle)
var port = 1883

var accepted_clients = [
	{'clientId': 'tester9000', 'token':'allow'},
	{'clientId': 'tester9001', 'token':'allow'},
	{'clientId': 'tester9002', 'token':'allow'},
	{'clientId': 'tester9003', 'token':'allow'}
]

process.on('SIGINT', function() {
    console.log("\nCaught interrupt signal");

   
        process.exit();
});

aedes.authenticate = function(client, username, password, callback) {
	console.log('Client connected. Login ...');
	//console.log(username);
	var client = accepted_clients.find((obj) => {
		return obj['clientId'] === username && obj['token'] === password.toString();

	})
	//console.log(password.toString());
	if (client !== undefined) {
		console.log(client);		
	}
	// two users with the same name can connect. This is a problem.
	callback(null, client !== undefined);
}

server.listen(port, function() {
  console.log('server listening on port', port);
});

aedes.subscribe('test', function(packet, cb) {
  console.log('Published', packet.payload.toString());
});

