var mqtt = require('mqtt');
const { exit } = require('process');

if(process.argv.length !== 7){
  console.log('ERR: command line arguments are not properly given')
  console.log('usage: This project simulates an IoT device')
  console.log('Example: ')
  console.log(' node client.js socketCount host port deviceId token')
  console.log(' node client.js 4 localhost 1883 device-110 f2a1e3-f2a1e3f2a1e3-f2a1e3')

  exit(0)
}



const args = process.argv;
const socketCount = args[2]
const host = args[3]
const port = args[4]
const deviceId = args[5]
const token = args[6]

var client = mqtt.connect('mqtt://'+host+':'+port+'/',
{
  username: deviceId,
  password: token
}

);
console.log(token)

// this function is for retrying connection in a  
function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}   
client.on('error', (err) => {
    console.log('error code', err.code);
    if(err.code === 5)
      console.log("Connection refused. Wrong token or client");
    console.log("retrying connection");
});

client.on('connect', function () {
  client.subscribe('test');
  client.subscribe('/device/'+ deviceId);
  client.publish('test', 'Hello mqtt');
})

client.on('message', function (topic, message) {
  // message is Buffer
  console.log(message.toString());
  client.end();
});
