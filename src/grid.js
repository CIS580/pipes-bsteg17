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
  this.cellBeingFilled = this.cells[0];
  console.log(this.cellBeingFilled);
}

Grid.prototype.render = function(ctx) {
  var self = this;
  self.cells.forEach(function(cell) {
    self.drawPipe(ctx, cell);
    cell.water.render();
    ctx.fillStyle = "white";
    ctx.font = "15px Georgia";
    console.log(cell.water.percentFull);
    ctx.fillText(cell.water.percentFull.toFixed(2), cell.x * self.cellWidth, cell.y * self.cellHeight + 15);
  });  
}

Grid.prototype.updateWater = function() {
  this.cellBeingFilled.water.percentFull += .2;
  if (this.cellBeingFilled.water.percentFull == 1) 
    var nextCell = this.getCellPointingTo(this.cellBeingFilled);
    if (nextCell != null) {
      this.cellBeingFilled = nextCell;
      this.cellBeingFilled.setInStone = true;
    } else { 
      console.log("game over");
    }
}

Grid.prototype.drawPipe = function (ctx, cell) {
  var self = this;
  var sprite = pipeTypes[cell.pipeType];
  var ss = self.spritesheet;
  ctx.save();
  ctx.translate((cell.x * self.cellWidth) + (self.cellWidth / 2), (cell.y * self.cellHeight) + (self.cellHeight / 2)); 
  ctx.rotate(cell.pipeDirection);
  ctx.drawImage( 
    ss.image,
    ss.spriteWidth * sprite.x, ss.spriteHeight * sprite.y,
    ss.spriteWidth, ss.spriteHeight, 
    -self.cellWidth / 2, -self.cellHeight / 2,
    self.cellWidth, self.cellHeight
  );
  ctx.restore();
}

Grid.prototype.getCell = function(click) {
  x = Math.floor(click.x / this.cellWidth);
  y = Math.floor(click.y / this.cellHeight);
  return this.cells[ (y * this.width) + (x % this.width) ];
}

Grid.prototype.getCellPointingTo = function(cell) {
  return this.cells[ cell.x + 1 ];
}

/* --- CLASS METHODS --- */
Grid.randomPipe = function () {
  pipes = Object.keys(pipeTypes).slice(1);
  return pipes[ Math.floor( Math.random() * pipes.length ) ];
}

Grid.randomDirection = function () {
  var angle = Math.random() * 2 * Math.PI;
  var x = ( Math.floor( angle / ( .5 * Math.PI ) ) * .5 * Math.PI ); 
  console.log(x); 
  return x;
}

/* --- PRIVATE METHODS --- */

Grid.prototype._initCells = function () {
  var self = this;
  var cells = [];
  //add starting pipe
  cells.push(new Cell(0, 0, "straight", 0, true));
  for (var i = 1; i < (self.width * self.height) - 1; i++) {
    cells.push(new Cell(i % self.width, Math.floor(i / self.height), "none", 0, false)); 
  }
  //add ending pipe
  cells.push(new Cell(self.width - 1, self.height - 1, "straight", 0, true));
  console.log(cells);
  return cells;
}
