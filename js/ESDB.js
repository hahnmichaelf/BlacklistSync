const fs = require('fs');
const https = require('https');
const request = require('request');

function esdb(){
  request
    .get('https://raw.githubusercontent.com/MrLuit/EtherScamDB/master/_data/scams.yaml')
    .on('error', function(err){
      console.log(err)
    })
    .pipe(fs.createWriteStream("./data/esdb.yaml"));
}

module.exports = esdb;
