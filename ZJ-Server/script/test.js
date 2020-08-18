const si = require('systeminformation');

setInterval(() => {
	si.cpuTemperature().then((data) => {
		console.log(data);
	});
}, 1000);
