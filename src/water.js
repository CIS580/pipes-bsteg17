/**
 * @module exports the Water class
 */
module.exports = exports = Water;

function Water(cell) {
  this.cell = cell;
  this.percentFull = 0;
}

Water.speed = .05;

Water.prototype.render = function(ctx, grid) {
  ctx.fillStyle = "white";
  ctx.font = "15px Georgia";
  ctx.fillText(this.percentFull.toFixed(2), (this.cell.x * grid.cellWidth), (this.cell.y * grid.cellHeight) + 10);
  if(this.percentFull == 0) return;
  if(this.percentFull == 100) this._drawFull();
  this._pipeDrawMethod();
}

Water.prototype.drawStraight = function() {

}

Water.prototype.drawBent = function() {

}

Water.prototype.drawTShaped = function() {

}

Water.prototype.drawCross = function() {

}

Water.prototype._pipeDrawMethod = function() {
  switch(this.cell.pipeType) {
    case "straight":
       return this.drawStraight;
    case "cross":
       return this.drawCross;
    case "bent":
       return this.drawBent;
    case "t-shaped":
       return this.drawTShaped;
  }
}

Water.prototype._drawFull = function() {
  
}
