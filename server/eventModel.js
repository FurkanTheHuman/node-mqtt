var mongoose = require('mongoose');// Setup schema
var eventSchema = mongoose.Schema({
    deviceId: {
        type: String,
        required: true
    },    
    event: {
        type: String,
        required: true
    },
    create_date: {
        type: Date,
        default: Date.now
    }
});// Export Client model
module.exports = mongoose.model('events', eventSchema);

module.exports.get = function (callback, limit) {
    Event.find(callback).limit(limit);
}