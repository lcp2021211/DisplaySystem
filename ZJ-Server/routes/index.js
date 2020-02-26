const router = require('express').Router();
const clientController = require('../controllers/clientController');

/** GET method */
router.get('/', function(req, res, next) {
	res.render('index', { title: 'Express' });
});
router.get('/getspy', clientController.getSpy);
router.get('/getspy2', clientController.getSpy2);
router.get('/getProxy', clientController.getProxy);
router.get('/addDomain', clientController.addDomain);
router.get('/distributeClient', clientController.distributeClient);


/** POST method */
router.post('/clientRegister', clientController.clientRegister);
router.post('/proxyRegister', clientController.proxyRegister);
router.post('/requestShuffle', clientController.requestShuffle);
router.post('/deleteClient', clientController.deleteClient);
router.post('/attacked', clientController.attacked);
router.post('/distributeID', clientController.distributeClientID);
router.post('/initializeAttack', clientController.initializeBeforeAttack);
router.post('/whetherBlock', clientController.whetherBlock);
router.post('/spyRegister', clientController.spyRegister);
router.post('/redistributeClient', clientController.redistributeClient);

module.exports = router;
