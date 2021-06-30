// Contains Useful Maths Functions for hachi
const errors = require('./errors');

// Main Math Functions
function Sin(x){ return Math.sin(x) }
function Cos(x){ return Math.cos(x) }
function Tan(x){ return Math.tan(x) }
function Arcsin(x){ return Math.asin(x) }
function Arccos(x){ return Math.acos(x) }
function Arctan(x){ return Math.atan(x) }
function Sinh(x){ return Math.sinh(x) }
function Cosh(x){ return Math.cosh(x) }
function Tanh(x){ return Math.tan(x) }
function Sqrt(x){ return Math.sqrt(x) }
function Cbrt(x){ return Math.cbrt(x) }
function Root(x, y){ return Math.pow(x, 1/y) }
function Floor(x){ return Math.floor(x) }
function Ceil(x){ return -Math.floor(-x) }
function Round(x){ return Math.round(x) }
function ToRad(x){ return x * Math.PI / 180 }
function ToDeg(x){ return x * 180 / Math.PI }
function Sign(x){ return Math.sign(x) }
function Pos(x){ return Math.abs(x) }
function Neg(x){ return -Math.abs(x) }
function Truncate(x, y){
  if(!y) y=0; return Math.trunc(x*10**y)/10**y;
}

// Specialized Math Functions

function Random(min, max){

  Random.int = function(min, max){
    return {
      value: Floor(Math.random()*(max-min+1)+min),
      min: min, max: max, range: max - min + 1
    }
  }
  Random.float = function(min, max){
    return {
      value: Math.random()*(max-min)+min,
      min: min, max: max, range: max - min
    }
  }
  Random.char = function(){
    let randInt = Floor(Random.int(97, 122).value);
    return {
      value: String.fromCharCode(randInt)
    }
  }
  Random.string = function(length){
    let code = '';
    for(let i=0; i<length; i++) code += Random.char().value;
    return {
      value: code,
      length: length
    }
  }

  return Random.float(0, 1);
}
Random();

function Clamp(x, min, max){
  return {
    value: Math.min(Math.max(min, x), max),
    min: min,
    max: max,
    clamped: x
  }
}

// Probability
function Factorial(x){
  if(x < 0) errors.noNegative('factorial');
  return {
    value: x == 0 ? 1 : x * Factorial(x-1).value,
    initial: x
  }
}
function DoubleFactorial(x){
  if(x < 0) errors.noNegative('doubleFactorial');
  return {
    value: x <= 1 ? 1 : x * Factorial(x-2).value,
    initial: x
  }
}
function Permutate(x, y){
  return Factorial(x)/Factorial(x-y);
}
function Combinate(x, y){
  return Factorial(x)/Factorial(y)*Factorial(x-y);
}

// Trigonometry
function Matrix2d(){
  Matrix2d.x = (rad) => {
    return Cos(rad);
  }
  Matrix2d.y = (rad) => {
    return Sin(rad);
  }
}
Matrix2d();

module.exports = {
  Sin, Cos, Tan,
  Arcsin, Arccos, Arctan,
  Sinh, Cosh, Tanh,
  Sqrt, Cbrt, Root,
  Floor, Ceil, Pos, Neg,
  Truncate, Round,
  Random, Clamp, Factorial,
  ToRad, ToDeg, Sign,
  DoubleFactorial, Permutate,
  Combinate, Matrix2d
}