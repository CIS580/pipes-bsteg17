"use strict";

/* Classes */
const Game = require('./game');
const EntityManager = require('./entityManager.js');

/* Global variables */
var canvas = document.getElementById('screen');
var entityManager = new EntityManager(onAssetsLoaded);
var game; 

canvas.onclick = function(event) {
  event.preventDefault();
  // TODO: Place or rotate pipe tile
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
