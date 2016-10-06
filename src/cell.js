/**
 * @module exports the Cell class
 */
module.exports = exports = Cell;

function Cell(x, y) {
  this.render = render;
  this.x = x;
  this.y = y;
  this.pipeStyle = null;
  this.pipeDirection = 0;
}

var render = function() {
  
}

/* --- PRIVATE METHODS --- */
