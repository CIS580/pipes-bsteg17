/**
 * @module exports the Cell class
 */
module.exports = exports = Grid;

var Cell = require('./cell.js');

function Grid(w,h,spritesheet) {
  this.render = render;
  this.spritesheet = spritesheet;
  this.width = w;
  this.height = h;
  this.cells = this._initCells();
}

var render = function(ctx) {
  
}

/* --- PRIVATE METHODS --- */

Grid.prototype._initCells = function () {
  var cells = [];
  for (var i = 0; i < this.width * this.height; i++) {
    cells.push(new Cell(i % this.width, Math.floor(i / this.height)));
  }
  return cells;
}
