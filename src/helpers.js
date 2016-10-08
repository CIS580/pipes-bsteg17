
/**
 * @module exports the Helpers class
 */
module.exports = exports = Helpers;

function Helpers() {
  this.arraysUnequal = arraysUnequal;
}

Helpers.arraysUnequal = function () {
  var a1 = arguments[0];
  for (var a = 1; a < arguments.length; a++) {
    a2 = arguments[a]; 
    if (Helpers.twoArraysEqual(a1, a2)) return false;
  }
  return true;
}

Helpers.twoArraysEqual = function(a1, a2) {
  if (a1.length != a2.length) return false;
  for (var i = 0; i < a1.length; i++) {
    if (a1[i] != a2[i]) return false;
  }
  return true;
}
