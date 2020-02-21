var express = require('express');
var router = express.Router();
const viewController = require('../controllers/viewController');
/* GET users listing. */
router.get('/', function(req, res, next) {
	res.send('respond with a resource');
});
router.post('/LoginByUsername', viewController.LoginByUsername);
router.get('/getUserInfo', viewController.getUserInfo);
router.get('/getSpy', viewController.getSpy);
router.post('/getSysInfo', viewController.getSysInfo);
router.post('/getSysUsage', viewController.getSysUsage);
router.post('/setClientNetworkInfo', viewController.setClientNetworkInfo);
router.get('/getClientNetworkInfo', viewController.getClientNetworkInfo);
router.get('/clearClient', viewController.clearClient);
module.exports = router;
