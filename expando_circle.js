function ExpandoCircle(x, y, maxDiameter, period) {
  this.x = x;
  this.y = y;
  this.maxDiameter = maxDiameter;
  this.period = period;
  this.beganLast = new Date();
  this.hovered = false;
  this.selected = false;
  this.circle = null;
  this.dead = false;
  this.update();
}
ExpandoCircle.prototype.render = function (gameEnv, thickness, r, g, b) {
  var colorDiffsToBG = {
    r: r - backgroundColor.r,
    g: g - backgroundColor.g,
    b: b - backgroundColor.b
  };
  var actualColor = {
    r: r - (colorDiffsToBG.r * this.progress),
    g: g - (colorDiffsToBG.g * this.progress),
    b: b - (colorDiffsToBG.b * this.progress)
  };
  gameEnv.renderCircle(this.circle, thickness, actualColor.r, actualColor.g, actualColor.b);
};
ExpandoCircle.prototype.update = function () {
  var now = new Date();
  var elapsed = now - this.beganLast;
  this.progress = elapsed / this.period;
  if (this.progress >= 1.0) {
    this.dead = true;
    return;
  }
  this.diameter = this.progress * this.maxDiameter;
  this.circle = new Phaser.Circle(this.x, this.y, this.diameter);
};
