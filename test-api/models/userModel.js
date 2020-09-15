var mongoose = require('mongoose');// Setup schema
var userSchema = mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    create_date: {
        type: Date,
        default: Date.now
    }
});// Export Client model
var User = module.exports = mongoose.model('users', userSchema);

module.exports.get = function (callback, limit) {
    User.find(callback).limit(limit);
}