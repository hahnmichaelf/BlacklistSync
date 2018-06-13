const fs = require('fs');
const https = require('https');
const request = require('request');

function esdb(){
  var esdb = request('https://raw.githubusercontent.com/MrLuit/EtherScamDB/master/_data/scams.yaml',
  {timeout: 30*1000}, function(e, response, body) {
    if (e || !([200, 301, 302].includes(response.statusCode))) {
      console.log('esdb grab failed this time.');
    }
    else{
      if(!e && response.statusCode == 200){
        fs.writeFileSync('./data/esdb.yaml', body, 'utf8', function(e,results){
            if(e) console.log(e);
        });
      }
    }
  })
}

module.exports = esdb;
