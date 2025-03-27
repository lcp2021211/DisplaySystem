const express = require('express');
const router = express.Router();
const controller = require('../controllers/controller');

/** GET method */
router.get('/', function (req, res, next) {
	res.render('index', { title: 'Express' });
});
router.get('/video', controller.readMp4);
router.get('/test', controller.detectAttack);
// router.get('/getImage', controller.getImage);
router.get('/getSysInfo', controller.getSysInfo);
router.get('/getVideoByRange', controller.rangeMp4);
router.get('/getWebmVideo', controller.getWebmVideo);

/** POST method */
router.post('/reconnect', controller.reconnect);

module.exports = router;
