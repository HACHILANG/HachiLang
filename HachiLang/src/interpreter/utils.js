/*
HACHI programming language


Authors: Fruity Animations

*/

const errors = require('../lib/errors');
const MathLexemeList = ['number', 'operator', 'separator', 'variable'];

let constants = [];

// Take Characters from line of Tokens
const takeChars = (line) => {
  let endStr = '';

  for(let token of line) endStr += token.chars;
  return endStr;
}

// Check if Variable is Available
function availableVar(variable, line, col, constant){
  if(constants.includes(variable)) errors.reassignConst(variable, line, col);
  if(constant) constants.push(variable);
  
  if(!variable) errors.expectedLiteral('a variable', line, col);
  if(variable.match(/[^A-z0-9\.]/g)) errors.unavailableVar(variable, line, col); 
  if(variable[0].match(/[^A-z]/)) errors.numericVar(variable, line, col);

  return variable;
}

const findSetEnd = (tokens, open, close) => {
    let setCount = 1;
    let args = [];

    // Check if in a Set
    for(let token of tokens){
      let oldToken = token;

      // Check if at End of Character
      if(!token) errors.expected(close, oldToken.line, oldToken.col);

      // Find if Current Token is a Set
      if(token.chars === open) setCount++;
      if(token.chars === close) setCount--;

      // Push Current Token into Expression
      if(setCount == 0) break;
      args.push(token);
    }
    return args;
  }

// Get Arguments from a List of Tokens
function getArguments(line){
  let args = [];
  let currArg = [];

  let parCount = 0;
  let brackCount = 0;
  let braceCount = 0;

  for(let i=0; i<line.length; i++){
  
    // Find if Character is a Comma
    if(line[i].chars === '(') parCount++;
    if(line[i].chars === ')') parCount--;
    if(line[i].chars === '[') brackCount++;
    if(line[i].chars === ']') brackCount--;
    if(line[i].chars === '[') braceCount++;
    if(line[i].chars === ']') braceCount--;

    if(line[i].lexeme === 'separator'
      && line[i].chars === ',' && brackCount == 0
      && parCount == 0 && braceCount == 0){

      // Add to Array
      args.push(currArg);
      currArg = [];

    // Otherwise Add to Current Argument
    } else {
      currArg.push(line[i]);
    }
  }

  if(currArg[0]) args.push(currArg); // Push Last Arg
  return args;
}

// Create a Stack of Evaluated Tokens
const createStack = (tokens, type) => {
  let stack = [];

  let mathStack = [];

  for(let i=0; i<tokens.length; i++){
    let token = tokens[i];
    
    if(token.lexeme === 'string'){
      if(mathStack[0] !== undefined){
        stack.push({ type: 'math', stack: mathStack });
        mathStack = [];
      }
      stack.push(token.chars);
    } else if(token.lexeme === 'number'){
      mathStack.push(Number(token.chars));
    } else if(token.lexeme === 'operator'){
      mathStack.push(token.chars);
    } else if(token.lexeme === 'separator'){
      mathStack.push(token.chars);
    } else if(token.lexeme === 'variable'){
      if(tokens[i+1] !== undefined 
      && tokens[i+1].lexeme === 'separator'
      && tokens[i+1].chars === '('){

        // Functions
        if(tokens[i+1].chars === '('){

          // No Parameters Given
          if(tokens[i+2].chars === ')'){
            mathStack.push({
              instruction: 'call',
              name: token.chars,
              args: []
            });
            i += 2;
          } else {
          // Parameters Given
            let tokened = tokens.slice(i+2);
            let tokenArgs = findSetEnd(tokened, '(', ')');
            let args = getArguments(tokenArgs);

            for(let j=0; j<args.length; j++){
              args[j] = createStack(args[j]);
            }

            mathStack.push({
              instruction: 'call',
              name: token.chars,
              args: args
            });

            i += 2+tokenArgs.length;
          }
        }
      } else {
        mathStack.push({ instruction: 'var', name: token.chars });
      }
    }
  }

  if(mathStack[0] !== undefined){
    stack.push({ type: 'math', stack: mathStack });
  }
  return stack;
}

module.exports = {
  parse: {
    stack: createStack,
    chars: takeChars,
    argms: getArguments,
    varbs: availableVar,
    endst: findSetEnd
  }
}