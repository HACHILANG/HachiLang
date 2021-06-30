// Contains Useful Array Functions for link
const errors = require('./errors');

function Array(value){
  return { value: value, type: 'array', 0: value, length: 1 }
}
function Join(value){
  let res = '';
  let i = 0;
  while(value[i] !== undefined){
    res += value[i];
    i++;
  }
  return res;
}

module.exports = {
  Array, Join
}