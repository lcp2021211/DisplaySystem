require('typescript-require');
const axios = require('axios');
const serverIP = require('../utils/global').serverIP;

let count = 0;
setInterval(() => {
  axios
    .post(`${serverIP}/attacked`, {
      attackVector: []
    })
    .then(res => {
      console.log(`Attack: ${count++}`);
    })
    .catch(err => {
      console.error(err);
    });
}, 2000);
