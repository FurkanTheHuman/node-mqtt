const mongoose = require('mongoose');
var aa=mongoose.connect('mongodb://localhost/iot', {useNewUrlParser: true, useUnifiedTopology: true });


let DeviceModel = require('./model')

let msg = new DeviceModel({
  deviceId: 'ADA.LOVELACE@GMAIL.COM'
  ,message: 'HELLO WORLD'
})
console.log('object')
msg.save()
   .then(doc => {
     console.log(doc)
   })
   .catch(err => {
     console.error(err)
   })
console.log("object")