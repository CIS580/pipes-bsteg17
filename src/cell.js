var Water = require('./water');

/**
 * @module exports the Cell class
 */
module.exports = exports = Cell;

function Cell(x, y, pipeType, pipeDirection, setInStone) {
  this.x = x;
  this.y = y;
  this.pipeType = pipeType; 
  this.pipeDirection = pipeDirection; 
  this.setInStone = setInStone; 
  this.water = new Water();
}

Cell.prototype.put = function(pipe, direction) {
  if (this.setInStone) return;
  this.pipeType = pipe;
  this.pipeDirection = direction;
}

Cell.prototype.rotate = function() {
  if (this.setInStone) return;
  this.pipeDirection = (this.pipeDirection + (Math.PI / 2)) % (Math.PI * 2);
}

/* --- PRIVATE METHODS --- */
