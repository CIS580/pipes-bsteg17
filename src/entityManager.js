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

EntityManager.prototype.addImage = function(url) {
  if(this.images[url]) return this.images[url];
  this.images[url] = new Image();
  this.images[url].onload = this.onLoad();
  this.images[url].src = url;
}
