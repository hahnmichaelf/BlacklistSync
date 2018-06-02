// Module returns true if completing successfully, otherwise it throws an error
var fs = require('fs');
var ealjson = require('./../../data/eal.json');
const getDateTime = require('./../../js/utils/getDateTime.js');

function createblacklist(){
  console.log(getDateTime() + 'Creating and initializing blacklist.json')
  var list = ealjson;
  console.log(getDateTime() + list.length + " domains added from eal in the last cycle.");
  fs.writeFileSync('./data/blacklist.json', JSON.stringify(list, null, 2), 'utf8', function(e,result){
    if(e) console.log(e);
    fs.close();
    return(true);
  });
};

module.exports = createblacklist;
