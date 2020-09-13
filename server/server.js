var aedes = require('aedes')()
var server = require('net').createServer(aedes.handle)
var port = 1883


aedes.authenticate = function(client, username, password, callback) {
	console.log('Client connected. Login ...');
	console.log(username);
	console.log(password.toString());
	callback(null,username==="domvel");
}

server.listen(port, function() {
  console.log('server listening on port', port);
});

aedes.subscribe('test', function(packet, cb) {
  console.log('Published', packet.payload.toString());
});

