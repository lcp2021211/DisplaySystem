const open = require('open');
async function openWithFirefox(url) {
	try {
		await open(url, { app: 'Firefox' });
	} catch (err) {
		console.error(err);
	}
}
for (let i = 0; i < 200; i++) {
	openWithFirefox(`http://10.108.87.131:${3000 + Math.round(i / 20)}/test`);
}
