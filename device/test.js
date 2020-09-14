var plug = require('./plug_simulator.js')

var x = new plug(5);


console.log(x.socketCount)

    console.log('V: ',x.getVoltage())
    console.log('POWER:',x.getPower())
    x.changeState(2, 'ON')
    console.log('V: ',x.getVoltage())
    console.log('POWER:',x.getPower())
   console.log('object')
   x.changeState(3, 'ON')
   console.log('V: ',x.getVoltage())
   console.log('POWER:',x.getPower())
   x.changeState(4, 'ON')
   console.log('V: ',x.getVoltage())
   console.log('POWER:',x.getPower())
  