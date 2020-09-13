var mqtt = require('mqtt');
var client = mqtt.connect('mqtt://localhost:1883/',
{
  username: 'omvel',
  password: 'secret'
}

);


client.on('error', (err) => {
    console.log('error', err.code);
    console.log("Connection refused. Wrong token or client");
    client.end()
});

client.on('connect', function () {
  client.subscribe('test');
  client.publish('test', 'Hello mqtt');
})

client.on('message', function (topic, message) {
  // message is Buffer
  console.log(message.toString());
  client.end();
});
