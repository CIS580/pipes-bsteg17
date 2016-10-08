(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

/* Classes */
const Game = require('./game');
const EntityManager = require('./entityManager.js');

/* Global variables */
var canvas = document.getElementById('screen');
var entityManager = new EntityManager(onAssetsLoaded);
var game; 

// right click
canvas.oncontextmenu = function (event) {
  event.preventDefault();
  game.rotatePipe( getClick(event) );
};

// left click
canvas.onclick = function(event) {
  event.preventDefault();
  game.putPipe( getClick(event) );
}

function getClick(e) {
  return {
    x: e.x - canvas.offsetLeft,
    y: e.y - canvas.offsetTop
  }
}

/**
 * @function masterLoop
 * Advances the game in sync with the refresh rate of the screen
 * @param {DOMHighResTimeStamp} timestamp the current time
 */
var resizeCanvas = function() {
  var widthHeightRatio = canvas.width / canvas.height; 
  canvas.height = window.innerHeight;
  canvas.width = window.innerHeight * widthHeightRatio;
}

/**
 * @function masterLoop
 * Advances the game in sync with the refresh rate of the screen
 * @param {DOMHighResTimeStamp} timestamp the current time
 */
var masterLoop = function(timestamp) {
  game.loop(timestamp);
  window.requestAnimationFrame(masterLoop);
}

/**
 * @function update
 * Updates the game state, moving
 * game objects and handling interactions
 * between them.
 * @param {DOMHighResTimeStamp} elapsedTime indicates
 * the number of milliseconds passed since the last frame.
 */
function update(elapsedTime) {

  // TODO: Advance the fluid
}

/**
  * @function render
  * Renders the current game state into a back buffer.
  * @param {DOMHighResTimeStamp} elapsedTime indicates
  * the number of milliseconds passed since the last frame.
  * @param {CanvasRenderingContext2D} ctx the context to render to
  */
function render(elapsedTime, ctx) {
  ctx.fillStyle = "#777777";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  game.grid.render(ctx); 
}

var loadAssets = function() {
  var images = [{filename:"pipes.png", width:127, height:160 }];
  images.forEach(function(image) {
    entityManager.addImage('./assets/'+image.filename, image.width, image.height);
  });
}

loadAssets();

function onAssetsLoaded() {
  var spritesheet = {};
      spritesheet.image = entityManager.images['./assets/pipes.png'];
      spritesheet.spriteWidth = spritesheet.image.width / 4;
      spritesheet.spriteHeight = spritesheet.image.height / 5;
  resizeCanvas();
  game = new Game(canvas, update, render, spritesheet); 
  masterLoop(performance.now());
}

},{"./entityManager.js":3,"./game":4}],2:[function(require,module,exports){
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

},{"./water":7}],3:[function(require,module,exports){
module.exports = exports = EntityManager;

function EntityManager(callback) {
  this.resourcesToLoad = 0;
  this.images = {};
  this.callback = callback;
}

EntityManager.prototype.onLoad = function() {
  this.resourcesToLoad--;
  if (this.resourcesToLoad == 0) this.callback();
}

EntityManager.prototype.addImage = function(url, width, height) {
  if(this.images[url]) return this.images[url];
  this.resourcesToLoad++;
  if (width && height) {
    this.images[url] = new Image(width, height);
  } else {
    this.images[url] = new Image();
  }
  this.images[url].onload = this.onLoad();
  this.images[url].src = url;
}

},{}],4:[function(require,module,exports){
"use strict";

var Cell = require('./cell.js');
var Grid = require('./grid.js');
var Helpers = require('./helpers.js');
console.log(Helpers);

/**
 * @module exports the Game class
 */
module.exports = exports = Game;

/**
 * @constructor Game
 * Creates a new game object
 * @param {canvasDOMElement} screen canvas object to draw into
 * @param {function} updateFunction function to update the game
 * @param {function} renderFunction function to render the game
 */
function Game(screen, updateFunction, renderFunction, spritesheet) {
  this.update = updateFunction;
  this.render = renderFunction;

  // Set up buffers
  this.frontBuffer = screen;
  this.frontCtx = screen.getContext('2d');
  this.backBuffer = document.createElement('canvas');
  this.backBuffer.width = screen.width;
  this.backBuffer.height = screen.height;
  this.backCtx = this.backBuffer.getContext('2d');

  // Start the game loop
  this.oldTime = performance.now();
  this.paused = false;

  //Other attrs
  this.spritesheet = spritesheet;
  this.grid = new Grid(8,8,this.spritesheet,screen);
}

Game.prototype.putPipe = function(click) {
  var cell = this.grid.getCell(click);
  if (Helpers.arraysUnequal([cell.x, cell.y], [0,0], [7,7])) cell.put( Grid.randomPipe(), Grid.randomDirection() );
}

Game.prototype.rotatePipe = function(click) {
  var cell = this.grid.getCell(click);
  if (Helpers.arraysUnequal([cell.x, cell.y], [0,0], [7,7])) cell.rotate();
}

/**
 * @function pause
 * Pause or unpause the game
 * @param {bool} pause true to pause, false to start
 */
Game.prototype.pause = function(flag) {
  this.paused = (flag == true);
}

/**
 * @function loop
 * The main game loop.
 * @param{time} the current time as a DOMHighResTimeStamp
 */
Game.prototype.loop = function(newTime) {
  var game = this;
  var elapsedTime = newTime - this.oldTime;
  this.oldTime = newTime;

  if(!this.paused) this.update(elapsedTime);
  this.render(elapsedTime, this.frontCtx);

  // Flip the back buffer
  this.frontCtx.drawImage(this.backBuffer, 0, 0);
}

/* --- PRIVATE METHODS ---*/


},{"./cell.js":2,"./grid.js":5,"./helpers.js":6}],5:[function(require,module,exports){
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
    self.drawPipe(ctx, cell);
    cell.water.render();
  });  
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
    cells.push(new Cell(i % self.width, Math.floor(i / self.height), "straight", 0, false)); 
  }
  //add ending pipe
  cells.push(new Cell(self.width - 1, self.height - 1, "straight", 0, true));
  console.log(cells);
  return cells;
}

},{"./cell.js":2}],6:[function(require,module,exports){

/**
 * @module exports the Helpers class
 */
module.exports = exports = Helpers;

function Helpers() {
  this.arraysUnequal = arraysUnequal;
}

Helpers.arraysUnequal = function () {
  var a1 = arguments[0];
  for (var a = 1; a < arguments.length; a++) {
    a2 = arguments[a]; 
    if (Helpers.twoArraysEqual(a1, a2)) return false;
  }
  return true;
}

Helpers.twoArraysEqual = function(a1, a2) {
  if (a1.length != a2.length) return false;
  for (var i = 0; i < a1.length; i++) {
    if (a1[i] != a2[i]) return false;
  }
  return true;
}

},{}],7:[function(require,module,exports){
/**
 * @module exports the Water class
 */
module.exports = exports = Water;

function Water(cell) {
  this.cell = cell;
  this.percentFull = 0;
}

Water.prototype.render = function() {
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

Water.prototype.pipeDrawMethod = function() {
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

},{}]},{},[1]);
