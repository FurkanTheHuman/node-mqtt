var mongoose = require('mongoose');// Setup schema
var deviceSchema = mongoose.Schema({
    deviceId: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true,
    },
    create_date: {
        type: Date,
        default: Date.now
    }
});// Export Client model
module.exports = mongoose.model('messages', deviceSchema);

module.exports.get = function (callback, limit) {
    Device.find(callback).limit(limit);
}