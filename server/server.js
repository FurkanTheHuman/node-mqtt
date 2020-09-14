var aedes = require('aedes')()
var server = require('net').createServer(aedes.handle)
var port = 1883

var accepted_clients = [
	{'clientId': 'tester9000', 'token':'allow', 'is_connected': false, 'generalId': null},
	{'clientId': 'tester9001', 'token':'allow', 'is_connected': false, 'generalId': null},
	{'clientId': 'tester9002', 'token':'allow', 'is_connected': false, 'generalId': null},
	{'clientId': 'tester9003', 'token':'allow', 'is_connected': false, 'generalId': null}
]

process.on('SIGINT', function() {
    console.log("\nCaught interrupt signal");
	// for a  smarter shutdown procedure 
	// pending...
   
    process.exit();
});

aedes.authenticate = function(client, username, password, callback) {
	
	console.log('Client connected. Login ...');
	//console.log(username);
	var selected_client = accepted_clients.find((obj) => {
		return obj['clientId'] === username && obj['token'] === password.toString();

	})
	//console.log(password.toString());
	if (selected_client !== undefined) {
		console.log(selected_client);
		if(selected_client['is_connected'] == false){
			selected_client['is_connected'] = true;
			selected_client['generalId'] = client.id;
			
			callback(null, selected_client !== undefined);	
		}
		else{
			var error = new Error('Client already connected');
			error.returnCode = 4
			console.log('Client already connected')
			callback(error, null);	
		}
	}else{
		var error = new Error('Auth error');
		error.returnCode = 5
		callback(error,null);	
	}

	// two users with the same name can connect. This is a problem.
	// Return correct error codes.
}

server.listen(port, function() {
  console.log('server listening on port', port);
});

aedes.subscribe('test', function(packet, cb) {
  console.log('Published', packet.payload.toString());
});

aedes.on('clientDisconnect', (client)=> {
	console.log(client.id)

	var selected_client = accepted_clients.find((cli) => {
		return cli['generalId'] === client.id;
	});
	selected_client['is_connected'] = false;
	selected_client['generalId'] = null;

})