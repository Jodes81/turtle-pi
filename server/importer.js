var vm = require("vm");
var fs = require("fs");
/*
module.exports = function(path, context) {
  context = context || {};
  var data = fs.readFileSync(path);
  vm.runInNewContext(data, context, path);
  return context;
}
*/
module.exports = function(path, importName) {
  context = {};
  var data = fs.readFileSync(path);
  vm.runInNewContext(data, context, path);
  return context[importName];
}
