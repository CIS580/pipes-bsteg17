/**
 * @module exports the Cell class
 */
module.exports = exports = Grid;

var Cell = require('./cell.js');
var Water = require('./water.js');

var pipeTypes = {"none":{x:0, y:4}, "straight":{x:3, y:1}, "bent":{x:1, y:1}};

function Grid(w, h, spritesheet, canvas) {
  this.spritesheet = spritesheet;
  this.canvas = canvas;
  this.width = w;
  this.height = h;
  this.cellWidth = canvas.width / w;
  this.cellHeight = canvas.height / h;
  this.cells = this._initCells();
  this.cellBeingFilled = this.cells[0];
}

Grid.level = 1;

Grid.prototype.render = function(ctx) {
  var self = this;
  self.cells.forEach(function(cell) {
    self.drawPipe(ctx, cell);
    cell.water.render(ctx, self);
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

Grid.prototype.updateWater = function() {
  var water = this.cellBeingFilled.water;
  water.percentFull += Water.speed;
  if (water.percentFull > 1.00) {
    water.percentFull = 1.00;
    this.cellBeingFilled = this.getNextCell();
    if (this.cellBeingFilled == null) { this._gameOver(); return; }
    console.log(this.cellBeingFilled, this.cellBeingFilled.x, this.cellBeingFilled.y);
    if (this.cellBeingFilled.x == (this.width - 1) && this.cellBeingFilled.y == (this.height - 1)) { this._nextLevel(); return; }
    this.cellBeingFilled.water.percentFull = Water.speed;
  }
}

Grid.prototype.getNextCell = function() {
  var self = this;
  switch(self.cellBeingFilled.feeding) {
    case "up":
      if (self.cellBeingFilled.y == 0) return null;
      return self._configureNextCell(this.cellBeingFilled.index(this) - this.width, "down");
    case "down":
      if (self.cellBeingFilled.y == 7) return null;
      return self._configureNextCell(this.cellBeingFilled.index(this) + this.width, "up");
    case "left":
      if (self.cellBeingFilled.x == 0) return null;
      return self._configureNextCell(this.cellBeingFilled.index(this) - 1, "right");
    case "right":
      if (self.cellBeingFilled.x == 7) return null;
      return self._configureNextCell(this.cellBeingFilled.index(this) + 1, "left");
  }
}

Grid.prototype._configureNextCell = function(nextCellIndex, fedBy) {
  var self = this;
  var cell = self.cells[nextCellIndex];
  if (cell.water.percentFull == 1.00) {return null;}
  if (!cell.hasConnection(self.cellBeingFilled)) return null; 
  cell.fedBy = fedBy;
  cell.setFeeding();
  cell.setInStone = true;
  return cell;
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
  console.log("initCElls");
  var self = this;
  var cells = [];
  //add starting pipe
  cells.push(new Cell(0, 0, "straight", 0, true, "left", "right"));
  for (var i = 1; i < (self.width * self.height) - 1; i++) {
    cells.push(new Cell(i % self.width, Math.floor(i / self.height), "none", 0, false, null, null)); 
  }
  //add ending pipe
  cells.push(new Cell(self.width - 1, self.height - 1, "straight", 0, true, "left", "right"));
  return cells;
}

Grid.prototype._gameOver = function() {
  var body = this.canvas.parentElement;
  body.innerHTML = '<h1>GAME OVER</h1><iframe src="giphy.gif" width="400" height="300"></iframe>';
}

Grid.prototype._nextLevel = function() {
  Water.speed += .05;
  Grid.level += 1;
  this.cells = this._initCells();
  this.cellBeingFilled = this.cells[0];
}
