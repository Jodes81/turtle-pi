'use strict';

function resolveAfter2Seconds(x) {
  return new Promise(function(resolve){
    console.log("HERE");
    setTimeout(function(){
      resolve(x);
    }, 2000);
  });
};
/*
function resolveAfter2Seconds(x) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(x);
    }, 2000);
  });
};
*/
(async function(x) { // async function expression used as an IIFE
  var a = resolveAfter2Seconds(20);
  var b = resolveAfter2Seconds(30);
  return x + await a + await b;
})(10).then(function(v){
  console.log(v);  // prints 60 after 2 seconds.
});

/*
(async function(x) { // async function expression used as an IIFE
  var a = resolveAfter2Seconds(20);
  var b = resolveAfter2Seconds(30);
  return x + await a + await b;
})(10).then(v => {
  console.log(v);  // prints 60 after 2 seconds.
});
*/
/*
var add = async function(x) { // async function expression assigned to a variable
  var a = await resolveAfter2Seconds(20);
  var b = await resolveAfter2Seconds(30);
  return x + a + b;
};

add(10).then(v => {
  console.log(v);  // prints 60 after 4 seconds.
});
*/