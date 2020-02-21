var express = require('express');
var router = express.Router();
const clientController = require('../controllers/clientController');
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
router.post('/clientRegister', clientController.clientRegister);
router.post('/proxyRegister', clientController.proxyRegister);
router.post('/requestShuffle', clientController.requestShuffle)
router.post('/deleteClient', clientController.deleteClient)
router.post('/attacked', clientController.attacked)
router.post('/distributeID', clientController.distributeClientID)
router.get('/getspy', clientController.getSpy)
router.get('/getspy2', clientController.getSpy2)
router.post('/initializeAttack', clientController.initializeBeforeAttack)
router.get('/getProxy', clientController.getProxy)
router.post('/whetherBlock', clientController.whetherBlock)
router.get('/addDomain', clientController.addDomain)
router.post('/spyRegister', clientController.spyRegister)
module.exports = router;
