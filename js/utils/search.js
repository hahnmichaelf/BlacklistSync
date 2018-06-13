// Module returns true if value is found, else: false
function search(val, list){
  for(var index = 0; index <= list.length; index++){
    if(val == list[index]){
      return(true);
    }
  }
  return(false);
}

module.exports = search;
