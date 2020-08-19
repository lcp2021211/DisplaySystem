const os = require('os');
const si = require('systeminformation');

setInterval(() => {
	si.cpu().then((data) => console.log(data));
}, 1000);
