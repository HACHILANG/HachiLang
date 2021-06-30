const run = require('./src/runhachi');
var file = process.argv.slice(2);
const execSync = require('child_process').execSync;


//get args in case


exports.getArg = () => {
  return file;
};



// Run The Main hachi Library


function hachiprep(){
  run('HachiLang/src/lib/math.ha');
}
hachiprep()

// Main hachi File


if (file[1] == ""){
  var debug = "False"
} else {
  if (file[1] == "stats"){
    var debug = "False"
  }
}
if (debug == "False"){

  run(file[0], false, "milliseconds");
} else {
  run(file[0], false);
}

