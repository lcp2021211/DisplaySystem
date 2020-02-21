let express = require('express');
let router = express.Router();
let controller = require('../controllers/controller');
/* GET home page. */
router.get('/', function(req, res, next) {
	res.render('index', { title: 'Express' });
});
router.get('/video', controller.readMp4);
router.get('/getVideoByRange', controller.rangeMp4);
router.get('/test', controller.detectAttack);
router.get('/getWebmVideo', controller.getWebmVideo);
router.post('/reconnect', controller.reconnect);
router.post('/getSysInfo', controller.getSysInfo);
router.get('/attack', function(req, res, next) {
	res.render('attack', { title: '攻击界面' });
});
router.get('/cpuInfo', controller.getCPUInfo);
router.get('/info', controller.getInfo);
module.exports = router;
