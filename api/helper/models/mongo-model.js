var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var iotSchema = new Schema({
    clientId: String,
    token: String,
});

module.exports = mongoose.model("clients", iotSchema);