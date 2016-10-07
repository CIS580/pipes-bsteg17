/**
 * @module exports the Cell class
 */
module.exports = exports = Cell;

function Cell(x, y, pipeType, pipeDirection) {
  this.render = render;
  this.x = x;
  this.y = y;
  pipeType ? this.pipeType = pipeType : this.pipeType = "none";
  pipeDirection ? this.pipeDirection = pipeDirection : this.pipeDirection = 0;
}

var render = function() {
  
}

/* --- PRIVATE METHODS --- */
