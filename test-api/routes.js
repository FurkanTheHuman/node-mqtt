// Filename: api-routes.js
// Initialize express router
let router = require('express').Router();
// Set default API response
var clientController = require('./controlers/clientController');
var userController = require('./controlers/userController');
var tokenController = require('./controlers/tokenController');

router.get('/', function (req, res) {
    res.json({
        status: 'API Its Working',
        message: 'Welcome to RESTHub crafted with love!'
    });
});

// device routes
router.route('/device')
    .get(clientController.index)
    .post(clientController.new);
    
router.route('/device/:device_id')
    .get(clientController.view)
    .patch(clientController.update)
    .put(clientController.update)
    .delete(clientController.delete);
// device routes END

// user routes
router.route('/users')
    .get(userController.index)
    .post(userController.new);
    
router.route('/users/:user_id')
    .get(userController.view)
    .patch(userController.update)
    .put(userController.update)
    .delete(userController.delete);
// user routes END

// token routes
router.route('/tokens')
    .get(tokenController.index)
    .post(tokenController.new);
    
router.route('/tokens/:user_id')
    .get(tokenController.view)
    .delete(tokenController.delete);
// token routes END




// Export API routes
module.exports = router;