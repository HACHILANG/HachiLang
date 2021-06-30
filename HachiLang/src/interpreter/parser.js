

const errors = require('../lib/errors');
const parseFuncs = require('./utils').parse;

/********** Main Parsing Function **********/
function parser(tokens){

  // Main Parsing Variables
  let instructions = [];

  let index = 0;
  let end = 0;

  let currInstruction = {};
  let token = tokens[index];

  // Add Instruction to Array
  const addInstruction = (toEnd) => {
    instructions.push(currInstruction);
    currInstruction = {};

    if(toEnd && end == -1) errors.expected(';', token.line, token.col);
    if(toEnd) advance(end-index);
  }

  // Move Forward a Token
  const advance = (i) => {
    index += i;
    token = tokens[index]
  }

  // Find End of Set
  const findSetEnd = (open, close) => {
    let setCount = 1;
    let args = [];

    // Check if in a Set
    while(setCount != 0){
      let oldToken = token;
      advance(1);

      // Check if at End of Character
      if(token === undefined) errors.expected(close, oldToken.line, oldToken.col);

      // Find if Current Token is a Set
      if(token.chars === open) setCount++;
      if(token.chars === close) setCount--;

      // Push Current Token into Expression
      if(setCount == 0) break;
      args.push(token);
    }
    return args;
  }


  /********** Loop Over all Tokens **********/
  while(token){

    // Find the End of the Line
    end = tokens.slice(index).findIndex(a => a.chars === ';')+index;
    if(end - index == -1) end = -1;

  /******* Set Variable *******/
    else if(token.lexeme == 'identifier'){
      let constant = token.chars === 'const';

      // Set and Retrieve Basic Information
      currInstruction.instruction = 'setvar';
      advance(1);

      currInstruction.name = token.chars;

      parseFuncs.varbs(token.chars, token.line, token.col, constant);
      advance(1);

      // Add to Instructions
      let setTokens = tokens.slice(index+1, end);
      if(token.chars != '=') errors.expected('=', token.line, token.col);
      
      currInstruction.type = 'math';
      if(setTokens.find(a => a.lexeme === 'string')){
        currInstruction.type = 'string';
      }

      currInstruction.expression = parseFuncs.stack(setTokens, currInstruction.type);
      if(!currInstruction.expression[0]){
        errors.valueNotFound(currInstruction.name, token.line, token.col);
      }
      
      addInstruction(true);
    }
    
  /******* Call or Edit Variables *******/
    else if(token.lexeme == 'variable'){

      // Set and Retrieve Basic Information
      let thisVar = token.chars;
      parseFuncs.varbs(token.chars, token.line, token.col);
      advance(1);

      // Call a Function
      if(token.chars === '('){

        // Find End of Statement
        let expression = findSetEnd('(', ')');
        currInstruction.args = parseFuncs.argms(expression);

        for(let j=0; j<currInstruction.args.length; j++){
          let currArg = currInstruction.args[j];
          
          if(currArg[0].chars !== '$'){
            currInstruction.args[j] = parseFuncs.stack(currArg);
          } else {
            continue;
          }
        }

        // Add to Instructions
        currInstruction.instruction = 'call';
        currInstruction.name = thisVar;

      // Edit Variable Values
      } else if(token.chars == '='){
        currInstruction.instruction = 'changevar';
        currInstruction.name = thisVar;
        
        let expression = tokens.slice(index+1, end);

        if(expression.find(a => a.lexeme === 'string')){
          currInstruction.type = 'string';
        } else {
          currInstruction.type = 'math';
        }
        currInstruction.expression = parseFuncs.stack(expression);
      
      // Operator Assigments
      } else if(token.chars.match(/[\+\-\*\/\%\^]/)){
        let thisOperator = token.chars;
        
        currInstruction.instruction = 'operate';
        currInstruction.name = thisVar;
        currInstruction.expression = parseFuncs.stack(tokens.slice(index+1, end), 'math');
        currInstruction.operator = thisOperator;
      } else {
        advance(-1);
        errors.unexpToken(token.chars, token.line, token.col);
      }
      addInstruction(true);
    }


  /******* Print an Expression *******/
    else if(token.chars == 'print'){

      // Retrieve and set Basic Information
      currInstruction.instruction = token.chars;
      advance(1);
      if(token.chars != '(') errors.expected('(', token.line, token.col);

      // Find End of Statement
      let expression = findSetEnd('(', ')');

      if(expression.find(a => a.lexeme === 'string')){
        currInstruction.type = 'string';
      } else {
        currInstruction.type = 'math';
      }
      currInstruction.expression = parseFuncs.stack(expression, currInstruction.type);

      addInstruction(true);
    }


  /******* gimme some credit :) *******/
    else if(token.chars == 'credits'){

      // Retrieve and set Basic Information
      currInstruction.instruction = token.chars;
      advance(1);
      if(token.chars != '(') errors.expected('(', token.line, token.col);

      // Find End of Statement
      let expression = findSetEnd('(', ')');

      if(expression.find(a => a.lexeme === 'string')){
        currInstruction.type = 'string';
      } else {
        currInstruction.type = 'math';
      }
      currInstruction.expression = parseFuncs.stack(expression, currInstruction.type);

      addInstruction(true);
    }


  /******* Make a command in the terminal *******/
    else if(token.chars == 'sys'){

      // Retrieve and set Basic Information
      currInstruction.instruction = token.chars;
      advance(1);
      if(token.chars != '(') errors.expected('(', token.line, token.col);

      // Find End of Statement
      let expression = findSetEnd('(', ')');

      if(expression.find(a => a.lexeme === 'string')){
        currInstruction.type = 'string';
      } else {
        currInstruction.type = 'math';
      }
      currInstruction.expression = parseFuncs.stack(expression, currInstruction.type);

      addInstruction(true);
    }
    else if(token.chars == 'hachi'){

      // Retrieve and set Basic Information
      currInstruction.instruction = token.chars;
      advance(1);
      if(token.chars != '(') errors.expected('(', token.line, token.col);

      // Find End of Statement
      let expression = findSetEnd('(', ')');

      if(expression.find(a => a.lexeme === 'string')){
        currInstruction.type = 'string';
      } else {
        currInstruction.type = 'math';
      }
      currInstruction.expression = parseFuncs.stack(expression, currInstruction.type);

      addInstruction();

    }

    else if(token.chars == 'input') {
      currInstruction.instruction = 'input';
      advance(1);
      if(token.chars != '(') errors.expected('(', token.line, token.col);

      let args = parseFuncs.argms(findSetEnd('(', ')'));
      currInstruction.expression = parseFuncs.stack(args[0], 'string');
      if(args[1]){
        currInstruction.variable = parseFuncs.chars(args[1], 'string');
      }
      
      addInstruction();
    }

  /******* Errors *******/
    else if(token.chars == 'error') {
      currInstruction.instruction = 'error';
      advance(1);
      if(token.chars != '(') errors.expected('(', token.line, token.col);

      let saying = parseFuncs.stack(findSetEnd('(', ')'), 'string');
      currInstruction.expression = saying;
      addInstruction();
    }
    

  /******* For Loops *******/
    else if(token.chars == 'for' && token.lexeme == 'keyword'){
      advance(1);
      if(token.chars != '('){
        advance(-1);
        errors.expected('(', token.line, token.col);
      }

      let oldIndex = index;
      let varName;
      let forArgs = findSetEnd('(', ')');

      // Takes Essential Parts of Statement
      let last = forArgs.findIndex(a => a.chars == 'as' && a.lexeme === 'connector');
      last = last == -1 ? 0 : last;

      let connector = forArgs.findIndex(a => a.chars == 'to' && a.lexeme === 'connector');
      if(connector == -1) errors.expected('to', token.line, token.col);
      
      let forStart = forArgs.slice(0, connector);
      let forEnd = !last ?  forArgs.slice(connector+1) : forArgs.slice(connector+1, last);

      if(last) varName = parseFuncs.varbs(forArgs[last+1] ? forArgs[last+1].chars : '', token.line, token.col);
      
      if(!forStart[0]) errors.expectedLiteral('a starting value', token.line, token.col);
      if(!forEnd[0]) errors.expectedLiteral('an ending value', token.line, token.col);

      // Checks for Variable Counter
      if(varName){
        currInstruction.instruction = 'setvar';
        currInstruction.name = varName;
        currInstruction.type = 'math';
        currInstruction.expression = parseFuncs.stack(forStart);
        addInstruction();
      }
      advance(1);

      // Looks for What is Inside the For Loop
      if(token.chars != '{'){
        advance(-1);
        errors.expected('{', token.line, token.col); 
      }

      // Add the Instructions to Array
      let forInstructions = parser(findSetEnd('{', '}'));
      
      if(varName){
        forInstructions.push({
          instruction: 'operate',
          name: varName,
          expression: parseFuncs.stack([{ lexeme: 'number', chars: 1 }], 'math'),
          operator: '+'
        });
        currInstruction.usingVar = true;
      }
      currInstruction.instruction = 'loop';
      currInstruction.start = parseFuncs.stack(forStart, 'math');
      currInstruction.end = parseFuncs.stack(forEnd, 'math');
      currInstruction.instructions = forInstructions;
      addInstruction();
    }

  /******* Functions *******/
    else if(token.chars == 'funct' && token.lexeme == 'keyword'){
      advance(1);

      if(token.lexeme != 'variable'){
        errors.fnName(token.line, token.col);
      }
      let fnName = parseFuncs.varbs(token.chars, token.line, token.col);
      advance(1);
      if(token.chars != '(' || token.lexeme != 'separator'){
        advance(-1);
        errors.expected('(', token.line, token.col);
      }

      let fnArgs = parseFuncs.argms(findSetEnd('(', ')'));
      advance(1);
      for(let i=0; i<fnArgs.length; i++) fnArgs[i] = fnArgs[i][0].chars;
      
      if(token.chars != '{'){
        advance(-1);
        errors.expected('{', token.line, token.col);
      }

      let fnInstructions = parser(findSetEnd('{', '}'));

      currInstruction.instruction = 'createFn';
      currInstruction.name = fnName;
      currInstruction.parameters = fnArgs;
      currInstruction.instructions = fnInstructions;
      addInstruction(); 
    }


  /******* Functions *******/
    else if(token.chars == 'func' && token.lexeme == 'keyword'){
      advance(1);

      if(token.lexeme != 'variable'){
        errors.fnName(token.line, token.col);
      }
      let fnName = parseFuncs.varbs(token.chars, token.line, token.col);
      advance(1);
      if(token.chars != '(' || token.lexeme != 'separator'){
        advance(-1);
        errors.expected('(', token.line, token.col);
      }

      let fnArgs = parseFuncs.argms(findSetEnd('(', ')'));
      advance(1);
      for(let i=0; i<fnArgs.length; i++) fnArgs[i] = fnArgs[i][0].chars;
      
      if(token.chars != '{'){
        advance(-1);
        errors.expected('{', token.line, token.col);
      }

      let fnInstructions = parser(findSetEnd('{', '}'));

      currInstruction.instruction = 'createFn';
      currInstruction.name = fnName;
      currInstruction.parameters = fnArgs;
      currInstruction.instructions = fnInstructions;
      addInstruction(); 
    }

  /******* Return Value *******/
    else if(token.chars == 'return' && token.lexeme == 'keyword'){
      currInstruction.instruction = 'return';
      let type = 'math';
      if(tokens.slice(index+1, end).find(a => a.lexeme == 'string')){
        type = 'string';
      }
      currInstruction.value = parseFuncs.stack(tokens.slice(index+1, end), type);
      addInstruction(true);
    }
  
  /******* Break and Continue *******/
    else if(token.chars == 'break' || token.chars == 'continue' && token.lexeme === 'keyword'){
      currInstruction.instruction = token.chars;
      addInstruction(true);
    }

  /******* If Statements *******/
    else if(token.chars == 'if' && token.lexeme == 'keyword'){
      advance(1);
      if(token.chars != '(' && token.lexeme == 'separator'){
        advance(-1);
        errors.expected('(', token.line, token.col);
      }

      let ifTokens = findSetEnd('(', ')');
      let ifArgs = [];
      let currStack = [];
      for(let i=0; i<ifTokens.length; i++){
        let curr = ifTokens[i];
        if(curr.lexeme === 'comparer' ||
        (curr.chars === '&' && curr.lexeme === 'separator')){
          if(currStack !== []){
            ifArgs.push(parseFuncs.stack(currStack));
          }
          ifArgs.push(curr);
          currStack = [];
        } else {
          currStack.push(curr);
        }
      }
      if(currStack !== []){
        ifArgs.push(parseFuncs.stack(currStack));
      }


      advance(1);
      if(token.chars != '{' && token.lexeme == 'separator'){
        advance(-1);
        errors.expected('{', token.line, token.col);
      }


      
      advance(1);
      if(token.lexeme === 'keyword' && token.chars === 'else'){
        advance(1);
        if(token.chars !== '{' || token.lexeme !== 'separator'){
          errors.expected('{', token.line, token.col);
        }

        let elseInstructions = parser(findSetEnd('{', '}'));
        currInstruction.elseInstructions = elseInstructions;
      } else {
        advance(-1);
      }

      let ifInstructions = parser(findSetEnd('{', '}'));
      currInstruction.instruction = 'if';
      currInstruction.comparison = ifArgs;
      currInstruction.instructions = ifInstructions;
      addInstruction();
    }
  
  
  /******* While Loops *******/
    else if(token.chars == 'while' && token.lexeme == 'keyword'){
      advance(1);
      if(token.chars != '(' && token.lexeme == 'separator'){
        advance(-1);
        errors.expected('(', token.line, token.col);
      }

      let whileTokens = findSetEnd('(', ')');
      let whileArgs = [];
      let currStack = [];
      for(let i=0; i<whileTokens.length; i++){
        let curr = whileTokens[i];
        if(curr.lexeme === 'comparer' ||
        (curr.chars === '&' && curr.lexeme === 'separator')){
          if(currStack !== []){
            whileArgs.push(parseFuncs.stack(currStack));
          }
          whileArgs.push(curr);
          currStack = [];
        } else {
          currStack.push(curr);
        }
      }
      if(currStack !== []){
        whileArgs.push(parseFuncs.stack(currStack));
      }
      
      advance(1);
      if(token.chars != '{' && token.lexeme == 'separator'){
        advance(-1);
        errors.expected('{', token.line, token.col);
      }
      let whileInstructions = parser(findSetEnd('{', '}'));
    
      currInstruction.instruction = 'while';
      currInstruction.comparison = whileArgs;
      currInstruction.instructions = whileInstructions;
      addInstruction();
    }

    advance(1); // At end of each Loop
  }

  return instructions;
}

module.exports = parser;