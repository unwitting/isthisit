function PulseCircle(x, y, minDiameter, maxDiameter, period) {
  this.x = x;
  this.y = y;
  this.maxDiameter = maxDiameter;
  this.minDiameter = this.diameter = minDiameter;
  this.diamDelta = this.maxDiameter - this.minDiameter;
  this.period = period;
  this.expanding = true;
  this.beganLast = new Date();
  this.hovered = false;
  this.selected = false;
  this.circle = null;
}
PulseCircle.prototype.render = function (gameEnv, thickness, r, g, b, forceFill) {
  var fill = this.hovered;
  if (forceFill) {
    fill = true;
  }
  gameEnv.renderCircle(this.circle, thickness, r, g, b, fill);
};
PulseCircle.prototype.update = function (gameEnv) {
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
  this.circle = new Phaser.Circle(this.x, this.y, this.diameter);
  this.hovered = this.circle.contains(
    gameEnv.game.input.mousePointer.x,
    gameEnv.game.input.mousePointer.y
  );
};
