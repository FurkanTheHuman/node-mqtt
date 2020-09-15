var mongoose = require('mongoose');// Setup schema
var clientSchema = mongoose.Schema({
    deviceId: {
        type: String,
        required: true
    },
    token: {
        type: String,
        required: true
    },
    create_date: {
        type: Date,
        default: Date.now
    }
});// Export Client model
var Client = module.exports = mongoose.model('clients', clientSchema);

module.exports.get = function (callback, limit) {
    Client.find(callback).limit(limit);
}