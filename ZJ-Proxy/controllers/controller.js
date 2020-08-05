// const utils = require('../utils/utils');
// const config = require('../config/config');
// const os = require('os');
const fs = require('fs');
const path = require('path');
const si = require('systeminformation');
const EventEmitter = require('events').EventEmitter;


/**
 *
 * Read mp4 from local, return in stream
 * @param {*} req: Request body
 * @param {*} res: Response body
 * @param {*} next: Middleware
 */
exports.readMp4 = (req, res, next) => {
	res.writeHead(200, { 'Content-Type': 'video/mp4' });
	let file = path.join(__dirname, '../public/test2.mp4');
	let rs = fs.createReadStream(file);
	setTimeout(() => {
		rs.emit('open');
	}, 3000);
	rs.emit('open');
	rs.on('open', () => {
		console.log('file opened');
	});
	rs.on('data', chunk => {
		console.log(chunk);
	});
	rs.on('end', function() {
		res.end();
		let emitter = new EventEmitter();
		emitter.emit('open', rs);
		rs.emit('open');
		console.log('end file');
	});
	rs.pipe(res);
};

/**
 * Read specific range of MP4 file
 * @param {*} req: Request body, range(start-end)
 * @param {*} res: Response body, MP4 stream
 * @param {*} next: Middleware
 */
exports.rangeMp4 = (req, res, next) => {
	let range = req.query.range;
	let file = path.join(__dirname, '../public/test2.mp4');
	let stat = fs.statSync(file);
	let fileSize = stat.size;
	if (range) {
		let rangeArray = range.split('-');
		let start = parseInt(rangeArray[0]);
		let end = parseInt(rangeArray[1]);
		let chunksize = end - start;
		let mp4 = fs.createReadStream(file, { start, end });
		let head = {
			'Content-Range': `bytes ${start}-${end}/${fileSize}`,
			'Accept-Ranges': 'bytes',
			'Content-Length': chunksize,
			'Content-Type': 'video/mp4'
		};
		res.writeHead(206, head);
		mp4.pipe(res);
	} else {
		res.send({
			fileSize: fileSize
		});
	}
};

/**
 * Get Webm Video to be compatible with Chrome browser, however it's not used any more.
 * @param {*} req: Request body, range(start-end)
 * @param {*} res: Response body, Webm stream
 * @param {*} next: Middleware
 */
exports.getWebmVideo = (req, res, next) => {
	let range = req.query.range;
	let file = path.join(__dirname, '../public/test.WebM');
	let stat = fs.statSync(file);
	let fileSize = stat.size;
	if (range) {
		let rangeArray = range.split('-');
		let start = parseInt(rangeArray[0]);
		let end = parseInt(rangeArray[1]);
		let chunksize = end - start;
		let mp4 = fs.createReadStream(file, { start, end });
		let head = {
			'Content-Range': `bytes ${start}-${end}/${fileSize}`,
			'Accept-Ranges': 'bytes',
			'Content-Length': chunksize,
			'Content-Type': 'video/webm'
		};
		res.writeHead(206, head);
		mp4.pipe(res);
	} else {
		res.send({
			fileSize: fileSize
		});
	}
};

/**
 * Send reconnect message to clients.
 * This is a crutial function of this controller.
 * @param {*} req: Request body, client2Proxy
 * @param {*} res: Response body, {code, message}
 * @param {*} next: Middleware
 */
exports.reconnect = (req, res, next) => {
	let client2Proxy = new Map(req.body);
	global.ws.forEach((conn, id) => {
		let message = JSON.stringify({
			type: 'switch',
			content: client2Proxy.get(id)
		});
		console.log(message);
		conn.sendUTF(message);
	});

	global.ws = new Map();
	res.send({
		code: 200,
		message: 'sent all active users'
	});
};

/**
 * Detecting whether this proxy is attacked, if so, send attack messages to server
 * @param {*} req: Request body, (attackFrequency, attackStrength)
 * @param {*} res: Response body
 * @param {*} next: Middleware
 */
exports.detectAttack = (req, res, next) => {
	let attackFrequency = req.query.attackFrequency;
	let attackStrength = req.query.attackStrength;
	if (typeof attackFrequency === 'undefined') {
		res.render('test');
	} else {
		console.log('we are under attack');
		global.attackFrequency += attackFrequency;
		global.attackStrength += attackStrength;
		res.render('test');
	}
}

/**
 * The client request in 1s interval to get system information
 * @param {*} req: Request body
 * @param {*} res: Response body, {code, info: {cpuUsage, memUsage, networkSpeed, diskUsage}}
 * @param {*} next: Middleware
 */
exports.getSysInfo = async (req, res, next) => {
	si.getDynamicData().then((data) => {
		res.send({
			code: 200,
			cpuSpeed: data.cpuCurrentspeed.avg,
			cpuLoad: data.currentLoad.currentload,
			memUsed: data.mem.used / 1073741824,
			memActive: data.mem.active / 1073741824,
			memFree: data.mem.free / 1073741824,
			fsRX: data.fsStats.rx_sec / 1048576,
			fsWX: data.fsStats.wx_sec / 1048576,
			fsTX: data.fsStats.tx_sec / 1048576,
			netRX: data.networkStats[0].rx_sec / 1048576,
			netTX: data.networkStats[0].tx_sec / 1048576,
		});
	});
};