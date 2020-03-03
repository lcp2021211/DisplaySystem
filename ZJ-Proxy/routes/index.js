const express = require('express');
const router = express.Router();
const controller = require('../controllers/controller');

/** GET method */
router.get('/', function(req, res, next) {
	res.render('index', { title: 'Express' });
});
router.get('/video', controller.readMp4);
router.get('/getVideoByRange', controller.rangeMp4);
router.get('/test', controller.detectAttack);
router.get('/getWebmVideo', controller.getWebmVideo);
router.get('/attack', function(req, res, next) {
	res.render('attack', { title: '攻击界面' });
});
router.get('/cpuInfo', controller.getCPUInfo);
router.get('/info', controller.getInfo);

/** POST method */
router.post('/reconnect', controller.reconnect);
router.post('/getSysInfo', controller.getSysInfo);

module.exports = router;
