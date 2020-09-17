Client = require('../models/clientModel');// Handle index actions


exports.index = function (req, res) {
    Client.get(function (err, clients) {
        if (err) {
            res.json({
                status: "error",
                message: err,
            });
        }
        res.json({
            status: "success",
            message: "clientss retrieved successfully",
            data: clients
        });
    });
};// Handle create clients actions
exports.new = function (req, res) {
    var clients = new Client();
    console.log(req.body)
    clients.deviceId = req.body.deviceId;
    clients.token = req.body.token;

    clients.save(function (err) {
        if (err)
            console.log('clients')
            console.log(clients)
            console.error(err);
        res.json({
            message: 'New clients created!',
            data: clients
        });
    });
};// Handle view clients info
exports.view = function (req, res) {
    Client.findById(req.params.clients_id, function (err, clients) {
        if (err)
            res.send(err);
        res.json({
            message: 'clients details loading..',
            data: clients
        });
    });
};// Handle update clients info
exports.update = function (req, res) {Client.findById(req.params.device_id, function (err, clients) {
        //if (err)
            
        console.log(req.params)
        clients.deviceId = req.body.deviceId;
        clients.token = req.body.token;
            clients.save(function (err) {
            if (err)
                res.json(err);
            res.json({
                message: 'clients Info updated',
                data: clients
            });
        });
    });
};// Handle delete clients
exports.delete = function (req, res) {
    Client.remove({
        _id: req.params.clients_id
    }, function (err, clients) {
        if (err)
            res.send(err);res.json({
            status: "success",
            message: 'Client deleted'
        });
    });
};