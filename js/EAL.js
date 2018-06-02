const fs = require('fs');
const https = require('https');
const request = require('request');

function eal(){
  request
    .get('https://raw.githubusercontent.com/409H/EtherAddressLookup/master/blacklists/domains.json')
    .on('error', function(err){
      console.log(err)
    })
    .pipe(fs.createWriteStream("./data/eal.json"));
}

module.exports = eal;
