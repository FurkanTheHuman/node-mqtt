var mqtt = require('mqtt');
const { exit } = require('process');



var readline = require('readline');
var rl = readline.createInterface(process.stdin, process.stdout);



//process.stdout.write('\033c')
// COLORS

Reset = "\x1b[0m"
Bright = "\x1b[1m"
Dim = "\x1b[2m"
Underscore = "\x1b[4m"
Blink = "\x1b[5m"
Reverse = "\x1b[7m"
Hidden = "\x1b[8m"

FgBlack = "\x1b[30m"
FgRed = "\x1b[31m"
FgGreen = "\x1b[32m"
FgYellow = "\x1b[33m"
FgBlue = "\x1b[34m"
FgMagenta = "\x1b[35m"
FgCyan = "\x1b[36m"
FgWhite = "\x1b[37m"

BgBlack = "\x1b[40m"
BgRed = "\x1b[41m"
BgGreen = "\x1b[42m"
BgYellow = "\x1b[43m"
BgBlue = "\x1b[44m"
BgMagenta = "\x1b[45m"
BgCyan = "\x1b[46m"
BgWhite = "\x1b[47m"

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
var socketState = null

if(typeof socketCount != 'number'){
  console.log("socket count arg should be a positive integer")
}
else{
  socketState = new Array(socketCount).fill(false);
}


var client = mqtt.connect('mqtt://'+host+':'+port+'/',
{
  username: deviceId,
  password: token,
  reconnectPeriod: 3000
}

);

// this function is for retrying connection in a  
function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}   
client.on('error', (err) => {
    console.log('error code', err.code);
    if(err.code === 'ECONNREFUSED'){
      console.log(warning('Server is down. Waiting for server'))
    }
    if(err.code === 5)
      console.log(warning("Connection refused. Wrong token or client"));
    console.log("retrying connection");
  });


client.on('connect', function () {
  client.subscribe('test');
  client.subscribe('/device/'+ deviceId);
  client.publish('test', 'Hello mqtt');
})

client.on('message', function (topic, message) {
  // message is Buffer
  console.log('From topic: '+topic+'\nMessage: '+ message.toString());
  rl.prompt()
  //client.end();
});







console.log(FgGreen+Underscore+'CLIENT INTERFACE IS ACTIVE', Reset)
console.log(FgGreen+'To turn ON or OFF a socket, type the socket number', Reset)
console.log(FgGreen+`Available socket range is ${FgRed}1${Reset} ${FgGreen}to${Reset} ${FgRed}`+ socketCount, Reset)
console.log(FgGreen+`For stopping client either use ${Underscore}ctrl-c${Reset}${FgGreen} or enter \'q\' to the prompt `, Reset)

/// test
rl.setPrompt(deviceId+'> ');
rl.prompt();
rl.on('line', function(line) {
    if (line === "quit" || line === 'q') rl.close();
    if (typeof parseInt(line) == 'number' && line < socketCount && line > 0){
        console.log("hello")
        socketState[parseInt(line)-1] = socketState[parseInt(line-1)]? false : true;
        socketState.forEach((element, i) => {
          console.log('Socket no-'+(i+1)+':',element? info('ON'):info('OFF'))
        });
    }else{
      console.log(typeof line)
      raise_error('socket number must be in range of 1 to '+ socketCount)
    }
    rl.prompt();
}).on('close',function(){
    process.exit(0);
});
/// test