const fs = require('fs');
const https = require('https');
const request = require('request');

function mmepd(){
  var eal = request('https://raw.githubusercontent.com/MetaMask/eth-phishing-detect/master/src/config.json',
  {timeout: 30*1000}, function(e, response, body) {
    if (e || !([200, 301, 302].includes(response.statusCode))) {
      console.log('mmepd grab failed this time.');
    }
    else{
      if(!e && response.statusCode == 200){
        fs.writeFileSync('./data/mm-epd.json', body, 'utf8', function(e,results){
            if(e) console.log(e);
        });
      }
    }
  })
}

module.exports = mmepd;
