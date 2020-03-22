const router = require('express').Router();
const clientController = require('../controllers/clientController');

/** GET method */
router.get('/', function(req, res, next) {
	res.render('index', { title: 'Express' });
});
router.get('/getSpy', clientController.getSpy);
router.get('/getProxy', clientController.getProxy);
router.get('/distributeClient', clientController.distributeClient);
router.get('/redistributeClient', clientController.redistributeClient);

/** POST method */
router.post('/attacked', clientController.attacked);
router.post('/whetherBlock', clientController.whetherBlock);
router.post('/clientOnline', clientController.clientOnline);
router.post('/clientOffline', clientController.clientOffline);
router.post('/proxyRegister', clientController.proxyRegister);
router.post('/requestShuffle', clientController.requestShuffle);
// router.post('/distributeClient', clientController.distributeClient);
// router.post('/redistributeClient', clientController.redistributeClient);
router.post('/initializeAttack', clientController.initializeBeforeAttack);
router.post('/shuffle', clientController.shuffle);

module.exports = router;
