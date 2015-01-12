function f(a) {
  return function() { return a++; }
}
var l = f(0);
console.log(l());
console.log(l());

