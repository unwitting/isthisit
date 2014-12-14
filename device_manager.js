function DeviceManager(gameEnv, x, y) {
  this.gameEnv = gameEnv;
  this.x = x;
  this.y = y;
  this.devices = [];
}

DeviceManager.prototype.addDevice = function(type) {
  var device;
  switch (type) {
    case 'pc':
      device = new PCDevice(this.gameEnv, this);
      break;
    case 'usb-storage':
      device = new USBStorageDevice(this.gameEnv, this);
      break;
  }
  var that = this;
  var spacing = 60;
  var total = spacing * this.devices.length;
  var left = this.x - (total / 2);
  device.updateCircle(left + (spacing * this.devices.length), that.y);
  this.devices.push(device);
  return device;
};

DeviceManager.prototype.clearDevices = function() {
  this.devices = [];
};

DeviceManager.prototype.deselectAll = function () {
  _.invoke(this.devices, 'deselect');
};

DeviceManager.prototype.render = function () {
  var that = this;
  var spacing = 60;
  var total = spacing * this.devices.length;
  var left = this.x - (total / 2);
  _.each(this.devices, function (dev, i) {
    dev.render(left + (spacing * i), that.y);
  });
};

DeviceManager.prototype.update = function () {
  var that = this;
  var spacing = 60;
  var total = spacing * this.devices.length;
  var left = this.x - (total / 2);
  _.each(this.devices, function (dev, i) {
    dev.update(left + (spacing * i), that.y);
  });
};
