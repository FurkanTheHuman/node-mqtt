var mqtt = require('mqtt');
const { exit } = require('process');

var SmartPlug = require('./plug_simulator.js')

var readline = require('readline');
const { parse } = require('path');
var rl = readline.createInterface(process.stdin, process.stdout);



//process.stdout.write('\033c')
// COLORS

Reset = "\x1b[0m"
Underscore = "\x1b[4m"


FgBlack = "\x1b[30m"
FgRed = "\x1b[31m"
FgGreen = "\x1b[32m"
FgYellow = "\x1b[33m"
FgBlue = "\x1b[34m"
FgMagenta = "\x1b[35m"
FgCyan = "\x1b[36m"
FgWhite = "\x1b[37m"
// COLORS END 

/// COLOR FUNCS
function info(msg) {
  return FgBlue+msg+Reset;
}

function warning(msg) {
  return FgYellow+msg+Reset;
}

function raise_error(msg) {
  console.log(FgRed+'Err: '+msg+Reset)
  console.log('usage: This project simulates an IoT device')
  console.log('Example: ')
  console.log('    node client.js socketCount host port deviceId token')
  console.log('    node client.js 4 localhost 1883 device-110 f2a1e3-f2a1e3f2a1e3-f2a1e3')

  
}


if(process.argv.length !== 7){
  raise_error('command line arguments are not properly given')
  exit(0)
}

console.clear()


const args = process.argv;
const socketCount = parseInt(args[2], 10)
const host = args[3]
const port = args[4]
const deviceId = args[5]
const token = args[6]




if(typeof socketCount != 'number'){
  console.log("socket count arg should be a positive integer")
}
else{
  socketState = new Array(socketCount).fill(false);
}

plug = new SmartPlug(socketCount)
var buffer = null

var client = mqtt.connect('mqtt://'+host+':'+port+'/',
{
  username: deviceId,
  password: token,
  reconnectPeriod: 3000
}

);

var int_kill;
client.on('error', (err) => {
    console.log('error code', err.code);
    if(err.code === 'ECONNREFUSED'){
      console.log(warning('Server is down. Waiting for server'))
    }
    if(err.code === 5)
      console.log(warning("Connection refused. Wrong token or client"));

    if(err.code === 4)
      console.log(warning("Client already connected"));
    if(int_kill){
        clearInterval(int_kill)
    }
    console.log("retrying connection");
  });


client.on('connect', function () {
    console.log("connect run should be once")
  client.subscribe('device/'+ deviceId);
  int_kill = setInterval(()=> {
    var payload = {
        type:"message",
        message:{
      socket_count: plug.socketCount,
      voltage: plug.getVoltage(),
      power: plug.getPower(),
      total_power: plug.getTotalPower()
    }}
  client.publish('device/'+ deviceId, JSON.stringify(payload));
    buffer = payload
  }, plug.interval * 1000)
  var payload = {type:"event",event: "connected"}

  client.publish('device/'+ deviceId, JSON.stringify(payload));

})

client.subscribe('device/'+ deviceId, (packet)=>{
    var message = JSON.parse(packet.payload.toString())
    if(message && message['type'] == 'plug') {
        plug.changeState(parseInt(message['number']))
        client.publish('device/'+ deviceId, JSON.stringify({type:'event', event:(plug.voltage_state[parseInt(message['number'])-1] < 0?"plugOff":"plugOn")}));    

    }
    
})


client.on('message', function (topic, message) {
//
});

function print_buffer(buf, interval) {
  if(buf === null)
    {
      console.log("buffering... ",  "[Interval = "+Math.floor(interval)+"]" )
      return
    }
  for (let i = 0; i < socketCount; i++) {
    console.log("> socket-"+(i+1)+" :" + (buf['message']['voltage'][i]==-1?info("OFF"): info(buf['message']['voltage'][i]))+ "  Power : "+ (buffer['message']['voltage'][i]<=0? 0 : buffer['message']['power'][i]) )
}
console.log("Total Power: " + buffer["total_power"])
}


console.log(FgGreen+Underscore+'CLIENT INTERFACE IS ACTIVE', Reset)
console.log(FgGreen+'To turn ON or OFF a socket, type the socket number', Reset)
console.log(FgGreen+'type "show" to see state of device', Reset)
console.log(FgGreen+`Available socket range is ${FgRed}1${Reset} ${FgGreen}to${Reset} ${FgRed}`+ socketCount, Reset)
console.log(FgGreen+`For stopping client either use ${Underscore}ctrl-c${Reset}${FgGreen} or enter \'q\' to the prompt `, Reset)


/// test
rl.setPrompt(deviceId+'> ');
rl.prompt();
rl.on('line', function(line) {
    if (line === "quit" || line === 'q') rl.close();
    else if (line === "show"){
        console.log(buffer)
      print_buffer(buffer, plug.interval)
    }
    else if (typeof parseInt(line) == 'number' && line <= socketCount && line > 0){
        /*console.log("hello")
        socketState[parseInt(line)-1] = socketState[parseInt(line-1)]? false : true;
        socketState.forEach((element, i) => {
          console.log('Socket no-'+(i+1)+':',element? info('ON'):info('OFF'))
        });*/

        plug.changeState(parseInt(line))
        client.publish('device/'+ deviceId, JSON.stringify({type:'event', event:(plug.voltage_state[parseInt(line)-1] < 0?"plugOff":"plugOn")}));
        
    }else{
      raise_error('socket number must be in range of 1 to '+ socketCount)
      //print errors for other commands
    }
    rl.prompt();
}).on('close',function(){
    var payload = {type:"event",event: "disconnected"}

    client.publish('device/'+ deviceId, JSON.stringify(payload), ()=>{
        setTimeout(()=>process.exit(0), 1000)
    });
    console.log('object')
});
/// test

