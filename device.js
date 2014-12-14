function Device(gameEnv) {
  this.gameEnv = gameEnv;
  this.inhabited = false;
}

Device.prototype.getRenderColor = function() {
  return this.inhabited?
    {r: 100, g: 255, b: 100}:
    {r: 100, g: 100, b: 100};
};

Device.prototype.getRenderFillColor = function() {
  var renderColor = this.getRenderColor();
  var delta = {
    r: renderColor.r - backgroundColor.r,
    g: renderColor.g - backgroundColor.g,
    b: renderColor.b - backgroundColor.b
  };
  var fillColor = {
    r: backgroundColor.r + (0.1 * delta.r),
    g: backgroundColor.g + (0.1 * delta.g),
    b: backgroundColor.b + (0.1 * delta.b)
  };
  return fillColor;
};

Device.prototype.isHovered = function () {
  return this.circle.contains(
    this.gameEnv.game.input.mousePointer.x,
    this.gameEnv.game.input.mousePointer.y
  );
};

Device.prototype.render = function (x, y) {
  this.circle = new Phaser.Circle(x, y, 50);
  if (this.isHovered()) {
    var fillColor = this.getRenderFillColor();
    this.gameEnv.renderCircle(
      this.circle,
      0.5, fillColor.r, fillColor.g, fillColor.b, true
    );
  }
  var color = this.getRenderColor();
  this.gameEnv.renderCircle(
    this.circle,
    0.5, color.r, color.g, color.b
  );
};

Device.prototype.update = function () {
  
};

function PCDevice(gameEnv) {
  Device.call(this, gameEnv);
}
PCDevice.prototype = Object.create(Device.prototype);
PCDevice.prototype.constructor = PCDevice;

PCDevice.prototype.render = function (x, y) {
  Device.prototype.render.call(this, x, y);
  var color = this.getRenderColor();
  this.gameEnv.renderRect(
    x - 12.5, y - 16.5, 25, 20, 1.5, color.r, color.g, color.b
  );
  this.gameEnv.renderRect(
    x - 16.5, y + 3.5, 33, 10, 1.5, color.r, color.g, color.b
  );
};

function USBStorageDevice(gameEnv) {
  Device.call(this, gameEnv);
}
USBStorageDevice.prototype = Object.create(Device.prototype);
USBStorageDevice.prototype.constructor = USBStorageDevice;

USBStorageDevice.prototype.render = function (x, y) {
  Device.prototype.render.call(this, x, y);
  var color = this.getRenderColor();
  this.gameEnv.renderRect(
    x - 18.5, y - 8, 30, 16, 1.5, color.r, color.g, color.b
  );
  this.gameEnv.renderRect(
    x + 11.5, y - 5, 8, 10, 1.5, color.r, color.g, color.b
  );
};
