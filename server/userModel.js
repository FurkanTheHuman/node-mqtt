var mongoose = require('mongoose');// Setup schema
var userSchema = mongoose.Schema({
    email: {
        type: String,
        required: true,
        uqiue:true
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
userSchema.methods.isCorrectPassword = function(password, callback){
      if (this.password !== password) {
        var err = new Error()
        callback(err);
      } else {
        callback(err, true);
      }
  }
var User = module.exports = mongoose.model('users', userSchema);

module.exports.get = function (callback, limit) {
    User.find(callback).limit(limit);
}