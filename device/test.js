var plug = require('./plug_simulator.js')

var x = new plug(5);


console.log(x.socketCount)

    console.log('V: ',x.getVoltage())
    console.log('POWER:',x.getPower())
    console.log('TOTAL POWER:',x.getTotalPower())

    x.changeState(2, 'ON')
    console.log('V: ',x.getVoltage())
    console.log('POWER:',x.getPower())
   x.changeState(3, 'ON')
   console.log('V: ',x.getVoltage())
   console.log('POWER:',x.getPower())
   console.log('TOTAL POWER:',x.getTotalPower())
  