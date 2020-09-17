var aedes = require('aedes')()	
var mongoose = require('mongoose');// Setup schema
var deviceModel = require('./model');
var userModel = require('./userModel');
var eventModel = require('./eventModel');


var url = "mongodb://localhost:27017/iot";
mongoose.connect(url, {useNewUrlParser: true, useUnifiedTopology: true });

var server = require('net').createServer(aedes.handle)

var port = 1883


var accepted_clients = [// these are demo clients. rest are in the MongoDB
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
    userModel.find({})
        .exec(function (err, users) {
            if (err) {
                throw 'HELP'
            }
            
            users.forEach((e)=>{
                var {email, password} = e
                accepted_clients.push(
	                {'clientId': email, 'token':password, 'is_connected': false, 'generalId': null},
                )
            })
        
    
	console.log('Client connected. Login ...');
	//console.log(username);
	var selected_client = accepted_clients.find((obj) => {
		return obj['clientId'] === username && obj['token'] === password.toString();
	})

	aedes.subscribe('device/'+selected_client['clientId'], function(packet,cb){
        
        //console.log(JSON.parse(packet.payload.toString())['message'])
        var idx = packet.topic.split('/')[1]

        var messagex = JSON.parse(packet.payload.toString())
        if(messagex && messagex['type'] == 'message'){

            let msg = new deviceModel({deviceId:idx, message:JSON.stringify(messagex['message'])})
            msg.save().then((r)=>console.log(r)).catch(e=>console.log(e))

        }
        if(messagex && messagex['type'] == 'event'){
            console.log(JSON.stringify(messagex['event']))

            let msg = new eventModel({deviceId:idx, event:JSON.stringify(messagex['event'])})
            msg.save().then((r)=>console.log(r)).catch(e=>console.log(e))

        }
        
        else{
            console.log(messagex)
        }
        /*var id = packet.topic.split('/')[1]
        console.log(packet.payload['message'])
        if( JSON.parse(packet.payload.toString())['message']){
            var message = packet.payload.toString()
            let msg = new deviceModel({deviceId:id, message:JSON.parse(message)})
            msg.save().then((r)=>console.log(r)).catch(e=>console.log(e))
        } else if( JSON.parse(packet.payload.toString())['event']){
            var event = packet.payload.toString()
            let msg = new eventModel({event:JSON.parse(event).event})
            msg.save().then((r)=>console.log(r)).catch(e=>console.log(e))
            
        }
        */
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
})

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