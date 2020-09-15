Token = require('../models/tokenModel');// Handle index actions


exports.index = function (req, res) {
    Token.get(function (err, token) {
        if (err) {
            res.json({
                status: "error",
                message: err,
            });
        }
        res.json({
            status: "success",
            message: "tokens retrieved successfully",
            data: token
        });
    });
};// Handle create token actions
exports.new = function (req, res) {
    var token = new Token();
    console.log(req.body)
    token.accepted_token = req.body.token;

    token.save(function (err) {
        if (err)
            console.log('token')
            console.log(token)
            console.error(err);
        res.json({
            message: 'New token created!',
            data: token
        });
    });
};// Handle view token info
exports.view = function (req, res) {
    Token.findById(req.params.token_id, function (err, token) {
        if (err)
            res.send(err);
        res.json({
            message: 'Token details loading..',
            data: token
        });
    });
};
// Handle delete token
exports.delete = function (req, res) {
    Token.remove({
        _id: req.params.token_id
    }, function (err, token) {
        if (err)
            res.send(err);res.json({
            status: "success",
            message: 'Token deleted'
        });
    });
};