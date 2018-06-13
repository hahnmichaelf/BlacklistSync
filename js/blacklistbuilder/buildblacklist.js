const fs = require('fs');
const fsEight = require('fs');
const yaml = require('js-yaml');
const json = require('json');
const async = require('async');
const exec = require('child_process').exec;
const createblacklist = require('./createblacklist.js');
const getDateTime = require('./../../js/utils/getDateTime.js');
const filter = require('./../../lists/filter.json');

var isJson = require('./../../js/utils/isJson.js')

var blacklistlengthquery = 0;
var count = 0;
var counttwo = 0;
var mmepdmergestatus = false;
var esdbmergestatus = false;
var ealmergestatus = false;

/* Start mmepd merge */
function mmepdmerge(){
  var mmepdjson;
  var search;
  var blist;
  async.series([
    function(callback){
      if(fs.existsSync('./data/mm-epd.json')) {
        mmepdjson = JSON.parse(fs.readFileSync('./data/mm-epd.json'));
        search = require('./../utils/search.js');
        blist = require('./../../data/blacklist');
        setTimeout( function(){
            callback();
        }, 3*1000);
      }
      else{
        setTimeout(
          function(){
            var intOne = setInterval(
              function(){
                if(fs.existsSync('./data/mm-epd.json')) {
                  mmepdjson = JSON.parse(fs.readFileSync('./data/mm-epd.json'));
                  search = require('./../utils/search.js');
                  blist = require('./../../data/blacklist');
                  clearInterval(intOne);
                  setTimeout( function(){
                      callback();
                  }, 3*1000);
                }
              }, 3*1000
            );
          }, 3*1000
        );
      };
    },
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
  var ealjson;
  var search;
  var blist;
  async.series([
    function(callback){
      if(fs.existsSync('./data/eal.json')) {
        ealjson = JSON.parse(fs.readFileSync('./data/eal.json'));
        search = require('./../utils/search.js');
        blist = require('./../../data/blacklist');
        setTimeout( function(){
            callback();
        }, 3*1000);
      }
      else{
        setTimeout(
          function(){
            var intTwo = setInterval(
              function(){
                if(fs.existsSync('./data/eal.json')) {
                  ealjson = JSON.parse(fs.readFileSync('./data/eal.json'));
                  search = require('./../utils/search.js');
                  blist = require('./../../data/blacklist');
                  clearInterval(intTwo);
                  setTimeout( function(){
                      callback();
                  }, 3*1000);
                }

              }, 3*1000
            );
          }, 3*1000
        );
      };
    },
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
  var esdbscams;
  var search;
  var blist;
  async.series([
    function(callback){
      if(fs.readFileSync('./data/esdb.yaml')){
        esdbscams = yaml.safeLoad(fs.readFileSync('./data/esdb.yaml'));
        search = require('./../utils/search.js');
        blist = require('./../../data/blacklist');
        setTimeout( function(){
            callback();
        }, 3*1000);
      }
      else{
        setTimeout(
          function(){
            var intThree = setInterval(
              function(){
                if(fs.readFileSync('./data/esdb.yaml')){
                  esdbscams = yaml.safeLoad(fs.readFileSync('./data/esdb.yaml'));
                  search = require('./../utils/search.js');
                  blist = require('./../../data/blacklist');
                  clearInterval(intThree);
                  setTimeout( function(){
                      callback();
                  }, 3*1000);
                }
              }, 3*1000
            );
          }, 3*1000
        );
      };
    },
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
