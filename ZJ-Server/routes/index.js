const router = require('express').Router();
const client = require('../controllers/client');
const service = require('../controllers/service')

/** GET method */
router.get('/', function(req, res, next) {
	res.render('index', { title: 'Express' });
});
// router.get('/getProxy', client.getProxy);
router.get('/distributeClient', client.distributeClient);
router.get('/redistributeClient', client.redistributeClient);

router.get('/getSpyInfo', service.getSpyInfo);
// router.get('/getUserInfo', service.getUserInfo);
router.get('/getProxyInfo', service.getProxyInfo);
router.get('/getServerInfo', service.getServerInfo);
router.get('/getSpyPercent', service.getSpyPercent);
router.get('/getClientNetworkInfo', service.getClientNetworkInfo);


/** POST method */
router.post('/shuffle', client.shuffle);
router.post('/attacked', client.attacked);
router.post('/whetherBlock', client.whetherBlock);
router.post('/clientOnline', client.clientOnline);
router.post('/clientOffline', client.clientOffline);
// router.post('/proxyRegister', client.proxyRegister);
// router.post('/requestShuffle', client.requestShuffle);
// router.post('/distributeClient', client.distributeClient);
// router.post('/redistributeClient', client.redistributeClient);
router.post('/initializeAttack', client.initializeBeforeAttack);

// router.post('/LoginByUsername', service.LoginByUsername);
router.post('/setClientNetworkInfo', service.setClientNetworkInfo);

module.exports = router;
