var fs = require('fs');
var fsEight = require('fs');
const yaml = require('js-yaml');
var json = require('json');
const async = require('async');
var exec = require('child_process').exec;
var createblacklist = require('./createblacklist.js');
const getDateTime = require('./../../js/utils/getDateTime.js');
const filter = require('./../../lists/filter.json');
var blacklistlengthquery = 0;
var count = 0;
var counttwo = 0;
var mmepdmergestatus = false;
var esdbmergestatus = false;
var ealmergestatus = false;

/* Start mmepd merge */
function mmepdmerge(){
  var mmepdjson = JSON.parse(fs.readFileSync('./data/mm-epd.json'));
  var search = require('./../utils/search.js');
  var blist = require('./../../data/blacklist');
  async.series([
    function(callback){
      var newblacklistitems = 0;
      for(var c = 0; c <= mmepdjson.blacklist.length; c++) {
        var searchstatus = true;
        if(search(mmepdjson.blacklist[c], blist) == true){
          // Do nothing
        }
        if(search(mmepdjson.blacklist[c], blist) == false){
          if(search(mmepdjson.blacklist[c], filter) == false){
            newblacklistitems = newblacklistitems + 1;
            blist.push(mmepdjson.blacklist[c]);
          }
        }
      }
      if(newblacklistitems != 0){
        console.log(getDateTime() + newblacklistitems + " domains added from mm-epd in the last cycle.");
      }
      callback();
    },
    function(callback){
      fs.writeFileSync('./data/blacklist.json', JSON.stringify(blist, null, 2), 'utf8', function(err,results){
        if(err) console.log(err);
        fs.close();
        callback();
      });
    }
  ],
    function(err,results){
      if(err){
        console.log("Error was found: " + err);
      }
    }
  );
};
/* End mmepd merge*/
/* Start eal merge */
function ealmerge(){
  var ealjson = JSON.parse(fs.readFileSync('./data/eal.json'));
  var search = require('./../utils/search.js');
  var blist = require('./../../data/blacklist');
  async.series([
    function(callback){
      var newblacklistitems = 0;
      for(var c = 0; c <= ealjson.length; c++) {
        var searchstatus = true;
        if(search(ealjson[c], blist) == true){
          // Do nothing
        }
        if(search(ealjson[c], blist) == false){
          if(search(ealjson[c], filter) == false){
            newblacklistitems = newblacklistitems + 1;
            blist.push(ealjson[c]);
          }
        }
      }
      if(newblacklistitems != 0){
        console.log(getDateTime() + newblacklistitems + " domains added from eal in the last cycle.");
      }
      callback();
    },
    function(callback){
      fs.writeFileSync('./data/blacklist.json', JSON.stringify(blist, null, 2), 'utf8', function(err,results){
        if(err) console.log(err);
        fs.close();
        callback();
      });
    }
  ],
    function(err,results){
      if(err){
        console.log("Error was found: " + err);
      }
    }
  );
};
/* End eal merge*/
/* Start esdb merge */
function esdbmerge(){
  let esdbscams = yaml.safeLoad(fs.readFileSync('./data/esdb.yaml'));
  var search = require('./../utils/search.js');
  var blist = require('./../../data/blacklist');
  async.series([
    function(callback){
      var newblacklistitems = 0;
      esdbscams.forEach(function(scam, index) {
        var searchstatus = true;
        var scamurl = scam.url  .replace('http://','')
                                .replace('https://','')
                                .replace('[.]','.')
                                .replace(' ', '/n')
                                .replace('www.','')
                                .split(/[/?#]/)[0];
        if(search(scamurl, blist) == true){
          // Do nothing
        }
        if(search(scamurl, blist) == false){
          if(search(scamurl, filter) == false){
            newblacklistitems = newblacklistitems + 1;
            blist.push(scamurl);
          }
        }
      });
      if(newblacklistitems != 0){
        console.log(getDateTime() + newblacklistitems + " domains added from esdb in the last cycle.");
      }
      if(blist.length != blacklistlengthquery){
        blacklistlengthquery = blist.length;
        console.log(getDateTime() + blist.length + " is the current number of domains in the blacklist.");
      }
      callback();
    },
    function(callback){
      fs.writeFileSync('./data/blacklist.json', JSON.stringify(blist, null, 2), 'utf8', function(err,results){
        if(err) console.log(err);
        fs.close();
        callback();
      });
    }
  ],
    function(err,results){
      if(err){
        console.log("Error was found: " + err);
      }
    }
  );
};
/* End esdb merge */

function buildstatus(status){
  mmepdmergestatus = false;
  ealmergestatus = false;
  esdbmergestatus = false;
  if(!status){
    createblackliststatus = createblacklist();
  }
  else{
    mmepdmergestatus = mmepdmerge();
    ealmergestatus = ealmerge();
    esdbmergestatus = esdbmerge();
  }
  return true;
};

module.exports = buildstatus;
