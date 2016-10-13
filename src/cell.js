var Water = require('./water');

/**
 * @module exports the Cell class
 */
module.exports = exports = Cell;

function Cell(x, y, pipeType, pipeDirection, setInStone, fedBy, feeding) {
  this.x = x;
  this.y = y;
  this.pipeType = pipeType; 
  this.pipeDirection = pipeDirection; 
  this.setInStone = setInStone; 
  this.fedBy = fedBy;
  this.feeding = feeding;
  this.water = new Water(this);
}

Cell.prototype.put = function(pipe, direction) {
  if (this.setInStone) return;
  var snd = new Audio("assets/put.wav"); // buffers automatically when created
  snd.play();
  this.pipeType = pipe;
  this.pipeDirection = direction;
}

Cell.prototype.rotate = function() {
  if (this.setInStone) return;
  var snd = new Audio("assets/rotate.wav"); // buffers automatically when created
  snd.play();
  this.pipeDirection = (this.pipeDirection + (Math.PI / 2)) % (Math.PI * 2);
}

Cell.prototype.index = function(grid) {
  return (this.y * grid.width) + this.x; 
}

Cell.prototype.hasConnection = function(donor) {
  switch(donor.feeding) {
    case "up":
      if(this.pipeType == "straight") {
        return this.pipeDirection == Math.PI * (1/2) || this.pipeDirection == Math.PI * (3/2)
      }
      if(this.pipeType == "bent") {
        return this.pipeDirection == 0 || this.pipeDirection == Math.PI * (1/2);
      }
    case "down":
      if(this.pipeType == "straight") {
        return this.pipeDirection == Math.PI * (1/2) || this.pipeDirection == Math.PI * (3/2)
      }
      if(this.pipeType == "bent") {
        return this.pipeDirection == Math.PI || this.pipeDirection == Math.PI * (3/2);
      }
    case "left":
      if(this.pipeType == "straight") {
        return this.pipeDirection == 0 || this.pipeDirection == Math.PI; 
      }
      if(this.pipeType == "bent") {
        return this.pipeDirection == 0 || this.pipeDirection == Math.PI * (3/2);
      }
    case "right":
      if(this.pipeType == "straight") {
        return this.pipeDirection == 0 || this.pipeDirection == Math.PI; 
      }
      if(this.pipeType == "bent") {
        return this.pipeDirection == Math.PI || this.pipeDirection == Math.PI * (1/2);
      }
  }
}

Cell.prototype.setFeeding = function() {
  if(this.pipeType == "straight") { this.feeding = this._straightPipeOutDirection(); }
  if(this.pipeType == "bent") { this.feeding = this._bentPipeOutDirection(); }
}

/* --- PRIVATE METHODS --- */

Cell.prototype._straightPipeOutDirection = function() {
  switch(this.fedBy) {
    case "up":
      if(this.pipeType == "straight") { return "down"; }
    case "down":
      if(this.pipeType == "straight") { return "up"; }
    case "left":
      if(this.pipeType == "straight") { return "right"; }
    case "right":
      if(this.pipeType == "straight") { return "left"; }
  }
}

Cell.prototype._bentPipeOutDirection = function() {
  switch(this.fedBy) {
    case "up":
      switch(this.pipeDirection) {
	case 0:
          return "right";
	case (Math.PI * (1/2)):
          return "left";
      }
    case "down":
      switch(this.pipeDirection) {
	case Math.PI:
          return "left";
	case (Math.PI * (3/2)):
          return "right";
      }
    case "left":
      switch(this.pipeDirection) {
	case (Math.PI * (1/2)):
          return "down";
	case Math.PI:
          return "up";
      }
    case "right":
      switch(this.pipeDirection) {
	case 0:
          return "down";
	case (Math.PI * (3/2)):
          return "up";
      }
  }
}
