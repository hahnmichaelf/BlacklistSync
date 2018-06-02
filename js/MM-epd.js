const fs = require('fs');
const https = require('https');
const request = require('request');

function mmepd(){
  request
    .get('https://raw.githubusercontent.com/MetaMask/eth-phishing-detect/master/src/config.json')
    .on('error', function(err){
      console.log(err)
    })
    .pipe(fs.createWriteStream("./data/mm-epd.json"));
}

module.exports = mmepd;
