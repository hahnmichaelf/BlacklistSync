'use strict';
// Importing Modules
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bodyparser = require('body-parser');
const path = require('path');
const yaml = require('js-yaml');
const fs = require('fs');
const json = require('json');
const async = require('async');
const route = require('./routes/route');
const default_template = fs.readFileSync('./static/default.html', 'utf8');
const getDateTime = require('./js/utils/getDateTime.js');

var mmepd = require('./js/MM-epd');
var eal = require('./js/EAL');
var esdb = require('./js/ESDB');

// Initialize
var app = express();

const port = 3000;

function startWebApp(){
  console.log(getDateTime() + "Starting web app now.")
  app.use('/api', route)

  // Add middleware
  app.use(cors());

  // Body - parser
  app.use(bodyparser.json());

  // Static Files
  app.use(express.static(path.join(__dirname, 'public')));

  // Homepage
  app.get('/', (req, res)=>{
    let template = fs.readFileSync('./static/index.html', 'utf8');
    let blacklist = require('./data/blacklist.json');
    let mmepdblacklist = require('./data/mm-epd.json');
    let ealblacklist = require('./data/eal.json');
    let esdbblacklist = yaml.safeLoad(fs.readFileSync('./data/esdb.yaml'));
    if(blacklist != null && mmepdblacklist != null && ealblacklist != null){
      template = template.replace('{{ blacklistsize }}', blacklist.length);
      template = template.replace('{{ ealblacklistsize }}', ealblacklist.length);
      template = template.replace('{{ mmepdblacklistsize }}', mmepdblacklist.blacklist.length);
      template = template.replace('{{ esdbblacklistzize }}', esdbblacklist.length)
      res.send(default_template.replace('{{ content }}', template));
    }
  });
  // About page
  app.get('/about', (req, res)=>{
    res.send(default_template.replace('{{ content }}', fs.readFileSync('./static/about.html', 'utf8')));
  });
  // Blacklist page
  app.get('/blacklist', (req, res)=>{
    res.send(default_template.replace('{{ content }}', fs.readFileSync('./static/blacklist.html', 'utf8')));
  });

  // Serve index.html
  app.get('/(/|index.html)?', function(req, res) {
    res.send(default_template.replace('{{ content }}', fs.readFileSync('./static/index.html', 'utf8')));
  });

  app.listen(port,()=>{
  });
}
function begin(){

  mmepd();
  setTimeout(function(){
    eal();
  }, 1*1000);
  setTimeout(function(){
    esdb();
  }, 2*1000);
  setTimeout(function(){
    var builder = require('./js/blacklistbuilder/buildblacklist');
    builder(false);
  }, 5*1000);
  setTimeout(function(){
    startWebApp();
  }, 15*1000);
  var checkvariance = require('./js/checkvariance/checkvariance.js');
  setTimeout(function() {
    checkvariance();
  }, 20*1000);
  setInterval(function() {
    if(!fs.existsSync('./data/blacklist.json')) {
      if(!fs.existsSync('./data/mm-epd.json')) {
        mmepd();
      }
      if(!fs.existsSync('./data/esdb.yaml')) {
        esdb();
      }
      if(!fs.existsSync('./data/eal.json')) {
        eal();
      }
      else{
        var builder = require('./js/blacklistbuilder/buildblacklist');
        builder(false);
      }
    }
    if(fs.existsSync('./data/blacklist.json')) {
      if(!fs.existsSync('./data/mm-epd.json')) {

        console.log(getDateTime() + " MM-epd.json dependency not found. Adding now.")
        mmepd();
      }
      if(!fs.existsSync('./data/esdb.yaml')) {
        console.log(getDateTime() + " esdb.yaml dependency not found. Adding now.")
        esdb();
      }
      if(!fs.existsSync('./data/eal.json')) {
        console.log(getDateTime() + " eal.json dependency not found. Adding now.")
        eal();
      }
      else{
        var buildbl = require('./js/blacklistbuilder/buildblacklist');
        async.series([
          function(callback){ //grab mm-epd
            mmepd();
            callback();
          },
          function(callback){ //grab eal
            eal()
            callback();
          },
          function(callback){ //grab esdb
            esdb();
            callback();
          },
          function(callback){ //update blacklist
            setTimeout(function() {
              buildbl(true);
            }, 4000);
            callback();
          },
          function(callback){ //update blacklist
            var checkvariance = require('./js/checkvariance/checkvariance.js');
            setTimeout(function() {
              checkvariance();
            }, 15*1000);
            callback();
          }
        ],
          function updated(err, results){
            if(err){
              console.log('error found');
            }
          }
        );
      }
    }
    else{

    }
  }, 3*60*1000); // Time to check and restart process - Every 3 minutes.
}
begin();
