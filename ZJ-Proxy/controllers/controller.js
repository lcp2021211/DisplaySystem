let fs = require('fs');
let path = require('path');
let EventEmitter = require('events').EventEmitter;
let utils = require('../utils/utils');
let config = require('../config/config');
let os = require('os');
let si = require('systeminformation');

/**
 *
 * Read mp4 from local, return in stream
 * @param {*} req: Request body
 * @param {*} res: Response body
 * @param {*} next: Middleware
 */
function readMp4(req, res, next) {
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
}

/**
 * Read specific range of MP4 file
 * @param {*} req: Request body, range(start-end)
 * @param {*} res: Response body, MP4 stream
 * @param {*} next: Middleware
 */
function rangeMp4(req, res, next) {
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
}

/**
 * Get Webm Video to be compatible with Chrome browser, however it's not used any more.
 * @param {*} req: Request body, range(start-end)
 * @param {*} res: Response body, Webm stream
 * @param {*} next: Middleware
 */
function getWebmVideo(req, res, next) {
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
}

/**
 * Send reconnect message to clients.
 * This is a crutial function of this controller.
 * @param {*} req: Request body, client2Proxy
 * @param {*} res: Response body, {code, message}
 * @param {*} next: Middleware
 */
function reconnect(req, res, next) {
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
}

/**
 * Detecting whether this proxy is attacked, if so, send attack messages to server
 * @param {*} req: Request body, (attackFrequency, attackStrength)
 * @param {*} res: Response body
 * @param {*} next: Middleware
 */
function detectAttackfunc(req, res, next) {
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
async function getSysInfo(req, res, next) {
	// let cpuUsage = os.loadavg()[0]
	// let totalmem = os.totalmem()
	// let freemem = os.freemem()
	// let memUsage = (totalmem - freemem) / totalmem
	let cpu = await si.currentLoad();
	let cpuUsage = cpu.currentload;
	let mem = await si.mem();
	let totalmem = mem.total;
	let used = mem.free;
	let memUsage = used / totalmem;
	let network = await si.networkStats();
	let networkSpeed = network[0].tx_sec / 1024;
	let disk = await si.disksIO();
	let diskUsage = disk.tIO_sec / 1024;
	console.log(cpuUsage, memUsage, networkSpeed, diskUsage);
	res.send({
		code: 20000,
		info: {
			cpuUsage: cpuUsage,
			memUsage: memUsage,
			networkSpeed: networkSpeed,
			diskUsage: diskUsage
		}
	});
}


/**
 * Get the information of CPU
 * @param {*} req: Request body
 * @param {*} res: Response body, {info}
 * @param {*} next: Middleware
 */
async function getCPUInfo(req, res, next) {
	let cpu = await si.currentLoad();
	let cpuUsage = cpu.currentload;
	res.send({
		info: cpuUsage
	});
}

/**
 * The client request in 1s interval to get system information
 * @param {*} req: Request body
 * @param {*} res: Response body, {info: {cpuUsage, memUsage, networkSpeed, diskIO, networkDropped, cpuSpeed, fsStats}}
 * @param {*} next: Middleware
 */
async function getInfo(req, res, next) {
	let cpu = await si.currentLoad();
	let cpuUsage = cpu.currentload;
	let cpuInfo = await si.cpuCurrentspeed();
	let mem = await si.mem();
	let memUsage = mem.free / mem.total;
	let network = await si.networkStats();
	let networkSpeed = network[0].tx_sec / 1024;
	let networkDropped = network[0].tx_dropped / 1024;
	let diskIO = await si.disksIO();
	let fsstat = await si.fsStats();

	res.send({
		info: {
			cpuUsage: cpuUsage,
			memUsage: memUsage,
			networkSpeed: networkSpeed,
			diskIO: diskIO.tIO_sec,
			networkDropped: networkDropped,
			cpuSpeed: cpuInfo.avg,
			fsStats: fsstat.tx_sec
		}
	});
}

module.exports = {
	detectAttack: detectAttackfunc,
	readMp4: readMp4,
	rangeMp4: rangeMp4,
	getWebmVideo: getWebmVideo,
	reconnect: reconnect,
	getSysInfo: getSysInfo,
	getCPUInfo: getCPUInfo,
	getInfo: getInfo
};

/**
 * Execute interval to detect whether send message to server
 */
setInterval(function() {
	if (global.attackFrequency !== 0 || global.attackStrength !== 0) {
		console.log('send frequency:', global.attackFrequency, ' send strength: ', global.attackStrength);
		utils
			.sendAttackMessage(global.attackFrequency, global.attackStrength)
			.then(res => {
				console.log(res);
			})
			.catch(err => {
				console.error(err);
			});
		global.attackStrength = 0;
		global.attackFrequency = 0;
	}
}, config.interval);
