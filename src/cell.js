/**
 * @module exports the Cell class
 */
module.exports = exports = Cell;

function Cell(x, y, pipeType, pipeDirection) {
  this.x = x;
  this.y = y;
  this.pipeType = pipeType; 
  this.pipeDirection = pipeDirection; 
}

Cell.prototype.put = function(pipe, direction) {
  this.pipeType = pipe;
  this.pipeDirection = direction;
}

Cell.prototype.rotate = function() {
  this.pipeDirection = (this.pipeDirection + (Math.PI / 2)) % (Math.PI * 2);
}

/* --- PRIVATE METHODS --- */
