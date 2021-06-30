/*
HACHI programming language


Authors: Fruity Animations


*/

// TOKENS
const OPERATORS = ['+', '-', '*', '/', '%', '^'];
const COMPARERS = ['=', '<', '>', '|', '!'];
const SEPARATORS = [';', '(', ')', '[', ']', '{', '}', ',', "'", '"', '$', '&&', '//'];

const KEYWORDS = ['print','error', 'input', 'clear', 'funct','func', 'if', 'else', 'for', 'while', 'return', 'break', 'pass', 'global','hachi','sys','credits'];
const CONNECTORS = ['of', 'in', 'to', 'and', 'as'];
const IDENTIFIERS = ['const', 'var'];
const ARRAY_PARAMS = ['anyCase', 'any'];

let inString = false, inConcat = false, deepConcat = false, inComment = false;

// Resetting Lines and Columns
function reset(){
  currLine = 0;
  currCol = 0;
  currGroup = '';

  inString = false;
  inConcat = false;
  deepConcat = false;
  inComment = false;
}

// TOKEN CREATOR
function newToken(charGroup){
  this.token = { lexeme: '', chars: charGroup }

  if(inString){
    this.token.lexeme = 'string';
  } else if(OPERATORS.includes(charGroup)){
    this.token.lexeme = 'operator';
  } else if(COMPARERS.includes(charGroup)){
    this.token.lexeme = 'comparer';
  } else if(IDENTIFIERS.includes(charGroup)){
    this.token.lexeme = 'identifier';
  } else if(SEPARATORS.includes(charGroup)){
    this.token.lexeme = 'separator';
  } else if(CONNECTORS.includes(charGroup)){
    this.token.lexeme = 'connector';
  } else if(KEYWORDS.includes(charGroup)){
    this.token.lexeme = 'keyword';
  } else if(Number(charGroup) == charGroup){
    this.token.lexeme = 'number';
  } else {
    this.token.lexeme = 'variable';
  }

  currGroup = '';

  this.token.line = currLine;
  this.token.col = currCol-this.token.chars.length;
  return this.token;
}

// LEXER
let currGroup = '';
let currStringToken = '';
let currLine = 0;
let currCol = 0;

function lexer(text){
  let tokens = [];
  let charArray = text.split('\n');
  
  for(let chars of charArray){
    currLine++;
    if(!inString) chars = chars.trim();
    if(!chars) continue;

    currCol = 0;
    
    for(let i=0; i<chars.length; i++){
      let char = chars[i]
      currCol++;

      if(!inComment){
        // String Methods
        if(char.match(/[\'\"]/)){
          if(currGroup[currGroup.length-1] === '\\'){
            currGroup = currGroup.substring(0, currGroup.length-1);
            currGroup += char;
          } else {
            if(char === currStringToken){
              if(currGroup) tokens.push(newToken(currGroup));
              inString = false;
              currStringToken = '';
              if(inConcat) inConcat = deepConcat = false;
              continue;
            } else {
              if(currStringToken === ''){
                if(currGroup) tokens.push(newToken(currGroup));
                currStringToken = char;
                inString = true;
              } else {
                currGroup += char;
              }
            }
          }

        // Concatenation for Strings
        } else if(char.match(/\&/gi)){
          if(currGroup[currGroup.length-1] !== '\\'){
            if(currGroup) tokens.push(newToken(currGroup));
            inString = false;
            
            inConcat = true;
          } else {
            currGroup = currGroup.substring(0, currGroup.length-1);
            currGroup += char;
          }

        // Keywords and Variables behind a Space
        } else if(char.match(/\s/gi) && !inString){
          if(currGroup) tokens.push(newToken(currGroup));
          if(inConcat && !deepConcat) inConcat = false, inString = true;
        
        // Comparers
        } else if(COMPARERS.includes(char) && !inString){
          if(currGroup) tokens.push(newToken(currGroup));
          tokens.push(newToken(char));
        
        // Separators
        } else if(SEPARATORS.includes(char) && !inString){
          if(char === '(' && inConcat) deepConcat = true;
          if(char === ')' && deepConcat) deepConcat = false;
          if(currGroup) tokens.push(newToken(currGroup));
          tokens.push(newToken(char));

        // Operators  
        } else if(OPERATORS.includes(char) && !inString){
          if(currGroup && !currGroup.match(/\//g)) tokens.push(newToken(currGroup));
          if(char !== '/'){
            tokens.push(newToken(char));
          } else {
            currGroup += '/';
            if(currGroup === '//'){
              inComment = true;
              currGroup = '';
            }
          }
          
        } else {
          if(currGroup === '/') tokens.push(newToken(currGroup));
          currGroup += char;
        }
      
      // Comments
      } else {
        if(char === '/'){
          currGroup += char;
          if(currGroup === '//' ){
            currGroup = '';
            inComment = false;
          }
        } else {
          currGroup = '';
        }
      }

      // Add Semicolon to End
      if(i == chars.length-1){
        if(!char.match(/[\;{\'\"\[\(\=\|\,\?\:\}]/)){
          if(!inString) chars += ';';
        }
      }
    }
  }
  if(currGroup) tokens.push(newToken(currGroup));
  
  return tokens;
}

module.exports = { lexer, reset };