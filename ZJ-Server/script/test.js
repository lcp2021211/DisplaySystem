const axios = require('axios');
const proxies = require('../config/proxies');

let requests = [];
for (let proxy of proxies) {
	requests.push(axios.get(`http://${proxy}/getSysInfo`));
}
axios.all(requests).then(
	axios.spread((...responses) => {
		console.log(responses);
	})
);
