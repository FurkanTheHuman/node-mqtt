var User = require('../models/userModel');// Handle index actions
const jwt = require('jsonwebtoken');

const secret = 'aaa';


exports.auth = function(req, res) {
    const { email, password } = req.body;
    
    console.log(req.body)
    console.log(email, password)
    User.findOne({ email }, function(err, user) {
      if (err) {
        console.error(err);
        res.status(500)
          .json({
          error: 'Internal error please try again'
        });
      } else if (!user) {
        res.status(401)
          .json({
            error: 'Incorrect email or password'
          });
      } else {
        user.isCorrectPassword(password, function(err, same) {
          if (err) {
            res.status(500)
              .json({
                error: 'Internal error please try again'
            });
          } else if (!same) {
            res.status(401)
              .json({
                error: 'Incorrect email or password'
            });
          } else {
            // Issue token
            const payload = { email };
            const token = jwt.sign(payload, secret, {
              expiresIn: '30d'
            });
            console.log({token})
            res.cookie('token', token, { httpOnly: true })
              //.sendStatus(200);
              res.json({ token });
          }
        });
      }
    });
  }

exports.index = function (req, res) {
    User.get(function (err, users) {
        if (err) {
            res.json({
                status: "error",
                message: err,
            });
        }
        res.json({
            status: "success",
            message: "users retrieved successfully",
            data: users
        });
    });
};// Handle create users actions
exports.new = function (req, res) {
    var users = new User();
    console.log(req.body)
    users.email = req.body.email;
    users.password = req.body.password;// save the users and check for errors
    users.save(function (err) {
        if (err)
            console.log(users)
            console.error(err);
        res.json({
            message: 'New users created!',
            data: users
        });
    });
};// Handle view users info
exports.view = function (req, res) {
    User.findById(req.params.users, function (err, users) {
        if (err)
            res.send(err);
        res.json({
            message: 'users details loading..',
            data: users
        });
    });
};// Handle update users info
exports.update = function (req, res) {User.findById(req.params.device_id, function (err, users) {
        //if (err)
            
        console.log(req.params)
        users.email = req.body.email;
        users.password = req.body.password;// save the users and check for errors
        users.save(function (err) {
            if (err)
                res.json(err);
            res.json({
                message: 'users Info updated',
                data: users
            });
        });
    });
};// Handle delete users
exports.delete = function (req, res) {
    User.remove({
        _id: req.params.users
    }, function (err, users) {
        if (err)
            res.send(err);res.json({
            status: "success",
            message: 'User deleted'
        });
    });
};