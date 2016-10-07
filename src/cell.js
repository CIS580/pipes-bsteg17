/**
 * @module exports the Cell class
 */
module.exports = exports = Cell;

function Cell(x, y) {
  this.render = render;
  this.x = x;
  this.y = y;
  this.pipeType = "cross";
  this.pipeDirection = 0;
}

var render = function() {
  
}

/* --- PRIVATE METHODS --- */
