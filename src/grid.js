/**
 * @module exports the Cell class
 */
module.exports = exports = Grid;

var Cell = require('./cell.js');

var pipeTypes = {"none":{x:0, y:4}, "cross":{x:0,y:0}};

function Grid(w, h, spritesheet, canvas) {
  this.spritesheet = spritesheet;
  this.width = w;
  this.height = h;
  this.cellWidth = canvas.width / w;
  this.cellHeight = canvas.height / h;
  this.cells = this._initCells();
}

Grid.prototype.render = function(ctx) {
  var self = this;
  self.cells.forEach(function(cell) {
    var sprite = pipeTypes[cell.pipeType];
    var ss = self.spritesheet;
    ctx.drawImage( 
      ss.image,
      ss.spriteWidth * sprite.x, ss.spriteHeight * sprite.y,
      ss.spriteWidth, ss.spriteHeight, 
      cell.x, cell.y,
      self.cellWidth, self.cellHeight
    );
  });  
}

/* --- PRIVATE METHODS --- */

Grid.prototype._initCells = function () {
  var cells = [];
  for (var i = 0; i < this.width * this.height; i++) {
    cells.push(new Cell(i % this.width, Math.floor(i / this.height)));
  }
  return cells;
}
