const exec = require('child_process').exec;
let proxyCount = process.argv.splice(2)[0];
for (let i = 0; i < proxyCount; i++) {
	exec(`npm start ${3000 + i}`, (err, stdout, stderr) => {
		if (err) {
			console.error(err);
		}
		console.log(stdout);
		console.log(stderr);
	});
}
