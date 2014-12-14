function Device(gameEnv) {
  this.gameEnv = gameEnv;
}

Device.prototype.isHovered = function () {
  return this.circle.contains(
    this.gameEnv.game.input.mousePointer.x,
    this.gameEnv.game.input.mousePointer.y
  );
};

Device.prototype.render = function (x, y) {
  this.circle = new Phaser.Circle(x, y, 50);
  if (this.isHovered()) {
    this.gameEnv.renderCircle(
      this.circle,
      1.5, 30, 60, 30, true
    );
  }
  this.gameEnv.renderCircle(
    this.circle,
    1.5, 100, 255, 100
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
  this.gameEnv.renderRect(x - 12.5, y - 16.5, 25, 20);
  this.gameEnv.renderRect(x - 16.5, y + 3.5, 33, 10);
};

function USBStorageDevice(gameEnv) {
  Device.call(this, gameEnv);
}
USBStorageDevice.prototype = Object.create(Device.prototype);
USBStorageDevice.prototype.constructor = USBStorageDevice;

USBStorageDevice.prototype.render = function (x, y) {
  Device.prototype.render.call(this, x, y);
  this.gameEnv.renderRect(x - 18.5, y - 8, 30, 16);
  this.gameEnv.renderRect(x + 11.5, y - 5, 8, 10);
};
