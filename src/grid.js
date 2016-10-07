/**
 * @module exports the Cell class
 */
module.exports = exports = Grid;

var Cell = require('./cell.js');

var pipeTypes = {"none":{x:0, y:4}, "cross":{x:0,y:0}, "straight":{x:3, y:1}, "bent":{x:1, y:1}, "t-shaped":{x:1, y:3}};

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
    console.log(); 
    ctx.drawImage( 
      ss.image,
      ss.spriteWidth * sprite.x, ss.spriteHeight * sprite.y,
      ss.spriteWidth, ss.spriteHeight, 
      cell.x * self.cellWidth, cell.y * self.cellHeight,
      self.cellWidth, self.cellHeight
    );
  });  
}

Grid.prototype.getCell = function(click) {
  x = Math.floor(click.x / this.cellWidth);
  y = Math.floor(click.y / this.cellHeight);
  return this.cells[ (y * this.width) + (x % this.width) ];
}

/* --- CLASS METHODS --- */
Grid.randomPipe = function () {
  pipes = Object.keys(pipeTypes).slice(1);
  return pipes[ Math.floor( Math.random() * pipes.length ) ];
}

/* --- PRIVATE METHODS --- */

Grid.prototype._initCells = function () {
  var self = this;
  var cells = [];
  //add starting pipe
  cells.push(new Cell(0, 0, "straight", 0));
  for (var i = 1; i < (self.width * self.height) - 1; i++) {
    cells.push(new Cell(i % self.width, Math.floor(i / self.height)));
  }
  //add ending pipe
  cells.push(new Cell(self.width - 1, self.height - 1, "straight", 0));
  return cells;
}
