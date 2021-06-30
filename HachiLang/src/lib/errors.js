const expected = (message, line, col) => {
  console.log('\x1b[31m\x1b[1mHachi Syntax Error: expected \'' + message + '\' at line ' + line + ' at column '  + col);
  process.exit();
}
const expectedLiteral = (message, line, col) => {
  console.log('\x1b[31m\x1b[1mHachi Syntax Error: expected ' + message + ' at line ' + line + ' at column '  + col);
  process.exit();
}
const fnName = (line, col) => {
  console.log('\x1b[31m\x1b[1mHachi Syntax Error: missing function name at line ' + line + ' at column ' + col);
  process.exit();
}
const variableNotFound = (name) => {
  console.log('\x1b[31m\x1b[1mHachi Syntax Error: variable ' + name + ' is not assigned');
  process.exit();
}
const functionNotFound = (name) => {
  console.log('\x1b[31m\x1b[1mHachi Syntax Error: function ' + name + ' is not assigned');
  process.exit();
}
const valueNotFound = (name, line, col) => {
  console.log('\x1b[31m\x1b[1mHachi Syntax Error: value for variable ' + name + ' was not found at line ' + line + ' at column ' + col);
  process.exit();
}
const unexpToken = (token, line, col) => {
  console.log('\x1b[31m\x1b[1mHachi Syntax Error: unexpected token \'' + token + '\' at line ' + line + ' at column ' + col);
  process.exit();
}

const reassignConst = (name, line, col) => {
  console.log('\x1b[31m\x1b[1mHachi Variable Error: constant ' + name + ' was reassigned at line ' + line + ' at column ' + col);
  process.exit();
}
const unavailableVar = (name, line, col) => {
  console.log('\x1b[31m\x1b[1mHachi Variable Error: variable ' + name + ' can only have alphanumeric characters at line ' + line + ' at column ' + col);
  process.exit();
}
const numericVar = (name, line, col) => {
  console.log('\x1b[31m\x1b[1mHachi Variable Error: variable ' + name + ' must start with an alphabetic character at line ' + line + ' at column ' + col);
  process.exit();
}

const noNegative = (name) => {
  console.log('\x1b[31m\x1b[1mHachi Runtime Error: function ' + name + ' does not allow a negative parameter');
  process.exit();
}

const emrtnval = () => {
  console.log('\x1b[31m\x1b[1mHachi Function Error: cannot have a empty return value, try using "break;"');
  process.exit();
}

module.exports = {
  expected,
  expectedLiteral,
  fnName,
  variableNotFound,
  functionNotFound,
  valueNotFound,
  unexpToken,
  reassignConst,
  unavailableVar,
  numericVar,
  noNegative,
  emrtnval
}