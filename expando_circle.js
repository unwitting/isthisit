function ExpandoCircle(
    gameEnv, x, y, minDiameter, maxDiameter, period, thickness, color
  ) {
  this.gameEnv = gameEnv;
  this.x = x;
  this.y = y;
  this.thickness = thickness;
  this.color = color;
  this.minDiameter = minDiameter;
  this.maxDiameter = maxDiameter;
  this.period = period;
  this.beganLast = new Date();
  this.hovered = false;
  this.selected = false;
  this.circle = null;
  this.dead = false;
  this.update();
}

ExpandoCircle.prototype.render = function () {
  var colorDiffsToBG = {
    r: this.color.r - backgroundColor.r,
    g: this.color.g - backgroundColor.g,
    b: this.color.b - backgroundColor.b
  };
  var actualColor = {
    r: this.color.r - (colorDiffsToBG.r * this.progress),
    g: this.color.g - (colorDiffsToBG.g * this.progress),
    b: this.color.b - (colorDiffsToBG.b * this.progress)
  };
  this.gameEnv.renderCircle(this.circle, this.thickness, actualColor.r, actualColor.g, actualColor.b);
};

ExpandoCircle.prototype.update = function () {
  var now = new Date();
  var elapsed = now - this.beganLast;
  this.progress = elapsed / this.period;
  if (this.progress >= 1.0) {
    this.dead = true;
    return;
  }
  this.diameter = 
    (this.progress * (this.maxDiameter - this.minDiameter)) + this.minDiameter;
  this.circle = new Phaser.Circle(this.x, this.y, this.diameter);
};
