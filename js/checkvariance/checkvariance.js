const json = require('json');
const yaml = require('js-yaml');
const fs = require('fs');
const async = require('async');
const getDateTime = require('./../../js/utils/getDateTime.js');
const filter = require('./../../lists/filter.json');

var mmepdneeded;
var ealneeded;
var esdbneeded;

function checkmmepd(){
  var blacklist = JSON.parse(fs.readFileSync('./data/blacklist.json'));
  var mmepd = JSON.parse(fs.readFileSync('./data/mm-epd.json'));
  var mmepdneeds = require('./../../data/writemm-epd.json');
  var search = require('./../utils/search.js');
  var currlength = mmepdneeds.length;
  var mmepdneeded = 0;
  async.series([
    function(callback){
      for(var i = 0; i <= blacklist.length; i++){
        if(search(blacklist[i], mmepd.blacklist) == true){
          // Do Nothing
        }
        if(search(blacklist[i], mmepd.blacklist) == false){
          if(search(blacklist[i], mmepdneeds) == false){
            mmepdneeded = mmepdneeded + 1;
            mmepdneeds.push(blacklist[i]);
          }
        }
      }
      if(mmepdneeded != 0){
        console.log(getDateTime() + mmepdneeded + " domains are missing from mmepd.");
      }
      callback();
    },
    function(callback){
      if(mmepdneeded != 0){
        fs.writeFileSync('./data/writemm-epd.json', JSON.stringify(mmepdneeds, null, 2), 'utf8', function(err,results){
          if(err) console.log(err);
          fs.close();
          callback();
        });
      }
    }
  ],
    function(err,results){
      if(err){
        console.log("Error was found: " + err);
      }
    }
  );
};

function checkeal(){
  var blacklist = JSON.parse(fs.readFileSync('./data/blacklist.json'));
  var eal = JSON.parse(fs.readFileSync('./data/eal.json'));
  var ealneeds = require('./../../data/writeeal.json');
  var currlength = ealneeds.length;
  var search = require('./../utils/search.js');
  var ealneeded = 0;
  async.series([
    function(callback){
      for(var i = 0; i <= blacklist.length; i++){
        if(search(blacklist[i], eal) == true){
          // Do Nothing
        }
        if(search(blacklist[i], eal) == false){
          if(search(blacklist[i], ealneeds) == false){
            ealneeded = ealneeded + 1;
            ealneeds.push(blacklist[i]);
          }
        }
      }
      if(ealneeded != 0){
        console.log(getDateTime() + ealneeded + " domains are missing from eal.");
      }
      callback();
    },
    function(callback){
      if(ealneeded != 0){
        fs.writeFileSync('./data/writeeal.json', JSON.stringify(ealneeds, null, 2), 'utf8', function(err,results){
          if(err) console.log(err);
          fs.close();
          callback();
        });
      }
    }
  ],
    function(err,results){
      if(err){
        console.log("Error was found: " + err);
      }
    }
  );
};

function checkesdb(){
  var blacklist = JSON.parse(fs.readFileSync('./data/blacklist.json'));
  var domains = yaml.safeLoad(fs.readFileSync('./data/esdb.yaml'));
  var esdb = [];
  var esdbneeds = require('./../../data/writeesdb.json');
  var currlength = esdbneeds.length;
  var search = require('./../utils/search.js');
  var esdbneeded = 0;
  async.series([
    function(callback){
      domains.forEach(function(scam, index) {
        var scamurl = scam.url  .replace('http://','')
                                .replace('https://','')
                                .replace('[.]','.')
                                .replace(' ', '/n')
                                .replace('www.','')
                                .replace('mailto:')
                                .split(/[/?#]/)[0];
        if(search(scamurl, filter) == true){
          // Do nothing
        }
        if(search(scamurl, filter) == false){
          esdb.push(scamurl);
        }
      });
      callback();
    },
    function(callback){
      for(var i = 0; i <= blacklist.length; i++){

        if(search(blacklist[i], esdb) == true){
          // Do nothing
        }
        if(search(blacklist[i], esdb) == false){
          if(search(blacklist[i], esdbneeds) == false){
            esdbneeded = esdbneeded + 1;
            esdbneeds.push(blacklist[i]);
          }
          // Else - already found in esdbneeds. Do nothing
        }
      }
      if(esdbneeded != 0){
        console.log(getDateTime() + esdbneeded + " domains are missing from esdb.");
      }
      callback();
    },
    function(callback){
      if(esdbneeded != 0){
        fs.writeFileSync('./data/writeesdb.json', JSON.stringify(esdbneeds, null, 2), 'utf8', function(err,results){
          if(err) console.log(err);
          fs.close();
          callback();
        });
      }
    }
  ],
    function(err,results){
      if(err){
        console.log("Error was found: " + err);
      }
    }
  );
};

function initwrites(){
  let jsonarray = [];
  var jsontemplate = JSON.stringify(jsonarray);
  async.series([
    function(callback){
      fs.writeFileSync('./data/writemm-epd.json', jsontemplate, 'utf8')
      callback();
    },
    function(callback){
      fs.writeFileSync('./data/writeeal.json', jsontemplate, 'utf8')
      callback();
    },
    function(callback){
      fs.writeFileSync('./data/writeesdb.json', jsontemplate, 'utf8')
      callback();
    }
  ],
    function(err,results){
      if(err){
        console.log("Error was found: " + err);
      }
    }
  );
}

function checkvariancestart(){
  initwrites();
  if(fs.existsSync('./data/blacklist.json') && fs.existsSync('./data/eal.json') && fs.existsSync('./data/esdb.yaml') && fs.existsSync('./data/mm-epd.json')){
    setTimeout(function(){
      checkmmepd();
      checkeal();
      checkesdb();
    }, 3*1000);
  }
  else{
    console.log("Err: Failed to find checkvariance files");
    return false;
  }
}

module.exports  = checkvariancestart;
