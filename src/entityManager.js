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
