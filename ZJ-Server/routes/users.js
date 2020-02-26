const router = require('express').Router();
const viewController = require('../controllers/viewController');

/** GET method */
router.get('/', function(req, res, next) {
	res.send('respond with a resource');
});
router.get('/getUserInfo', viewController.getUserInfo);
router.get('/getSpy', viewController.getSpy);
router.get('/getClientNetworkInfo', viewController.getClientNetworkInfo);
router.get('/clearClient', viewController.clearClient);

/** POST method */
router.post('/LoginByUsername', viewController.LoginByUsername);
router.post('/getSysInfo', viewController.getSysInfo);
router.post('/getSysUsage', viewController.getSysUsage);
router.post('/setClientNetworkInfo', viewController.setClientNetworkInfo);

module.exports = router;
