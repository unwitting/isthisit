function PulseCircle(gameEnv, x, y, minDiameter, maxDiameter, period, thickness, color) {
  this.gameEnv = gameEnv;
  this.x = x;
  this.y = y;
  this.minDiameter = this.diameter = minDiameter;
  this.maxDiameter = maxDiameter;
  this.period = period;
  this.thickness = thickness;
  this.color = color;
  this.diamDelta = this.maxDiameter - this.minDiameter;
  this.expanding = true;
  this.beganLast = new Date();
  this.circle = null;
  this.updateCircle();
}

PulseCircle.prototype.render = function (fill) {
  fill = fill === undefined? false: fill;
  this.gameEnv.renderCircle(
    this.circle,
    this.thickness,
    this.color.r,
    this.color.g,
    this.color.b,
    fill
  );
};

PulseCircle.prototype.update = function () {
  var now = new Date();
  var elapsed = now - this.beganLast;
  this.progress = elapsed / this.period;
  while (this.progress >= 1.0) {
    this.expanding = !this.expanding;
    this.progress = this.progress - 1;
    this.beganLast = now - (this.progress * this.period);
  }
  //gameEnv.game.debug.text(this.progress, 10, 25, '#000000');
  var diamProgress = this.progress * this.diamDelta;
  this.diameter = this.expanding?
    this.minDiameter + diamProgress:
    this.maxDiameter - diamProgress;
  this.updateCircle();
};

PulseCircle.prototype.updateCircle = function () {
  this.circle = new Phaser.Circle(this.x, this.y, this.diameter);
};
