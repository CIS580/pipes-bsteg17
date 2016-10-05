"use strict";

/* Classes */
const Game = require('./game');
const EntityManager = require('./entityManager.js');

/* Global variables */
var canvas = document.getElementById('screen');
var game = new Game(canvas, update, render);
var entityManager = new EntityManager(onAssetsLoaded);

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
resizeCanvas();
masterLoop(performance.now());


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

  // TODO: Render the board

}

var loadAssets = function() {
  var imageFilenames = ["pipes.png"];
  imageFilenames.forEach(function(filename) {
    entityManager.addImage('./assets/'+filename);
  });
}

loadAssets();
function onAssetsLoaded() {
  resizeCanvas();
  masterLoop(performance.now());
}
