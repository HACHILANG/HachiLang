// Contains Useful String Functions for hachi

const errors = require('./errors');

function Replace(string, replacer, replacement){
  let i = 0;
  for(let i=replacer.length; i<string.length+1; i++){
    let currStr = string.slice(i-replacer.length, i);
    if(currStr === replacer){
      let beginning = string.slice(0, i-replacer.length);
      let end = string.slice(i);
      string = beginning + replacement + end;
      i+=replacement.length-replacer.length;
    }
  }
  return string;
}
function Slice(string, start, end){
  if(!end)
  return string.slice(start, end+1);
}
function Contains(string, chars){
  return string.includes(chars);
}
function Index(string, chars){
  return string.indexOf(chars);
}
function Trim(string){
  return string.trim();
}
function TrimLeft(string){
  return string.trimLeft();
}
function TrimRight(string){
  return string.trimRight();
}
function Upper(string){
  return string.toUpperCase();
}
function Lower(string){
  return string.toLowerCase();
}
function StartsWith(string, chars){
  return string.startsWith(chars);
}
function EndsWith(string, chars){
  return string.endsWith(chars);
}
function Capitalize(string){
  return string[0].toUpperCase() + string.slice(1);
}
function Reverse(string){
  return string.split('').reverse().join('');
}
function Split(string, splitter){
  if(!splitter) splitter = '';
  let res = { value: string, type: 'array', length: string.length };
  let splitString = string.split(splitter);
  for(let i=0; i<splitString.length; i++){
    res[i] = splitString[i];
  }
  return res;
}
function Ascii(character){
  if(character.length != 1) errors.expectedLiteral('a length of 1');
  return character
}

module.exports = {
  Slice, Replace, Contains,
  Index, Trim, TrimLeft,
  TrimRight, Upper, Lower,
  StartsWith, EndsWith,
  Capitalize, Reverse,
  Split, Ascii
}