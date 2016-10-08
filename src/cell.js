/**
 * @module exports the Cell class
 */
module.exports = exports = Cell;

function Cell(x, y, pipeType, pipeDirection) {
  this.x = x;
  this.y = y;
  pipeType ? this.pipeType = pipeType : this.pipeType = "none";
  pipeDirection ? this.pipeDirection = pipeDirection : this.pipeDirection = 0;
}

Cell.prototype.put = function(pipe) {
  this.pipeType = pipe;
}

Cell.prototype.rotate = function() {
  this.pipeDirection = (this.pipeDirection + (Math.PI / 2)) % (Math.PI * 2);
}

/* --- PRIVATE METHODS --- */
