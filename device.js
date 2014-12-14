function Device(gameEnv, deviceManager) {
  this.gameEnv = gameEnv;
  this.deviceManager = deviceManager;
  this.circle = null;
  this._forceUnclickable = false;
  this._inhabited = false;
  this.selected = false;
  this.expandoCircles = [];
}

Device.prototype.addExpandoCircle = function () {
  if (!this.circle) {
    return;
  }
  var expandoCircle = new ExpandoCircle(
    this.gameEnv,
    this.circle.x, this.circle.y,
    this.circle.radius * 2,
    (this.circle.radius * 2) + 400,
    800,
    0.5,
    this.getRenderColor()
  );
  this.expandoCircles.push(expandoCircle);
};

Device.prototype.deselect = function() {
  if (this.selected) {
    this.selected = false;
  }
};

Device.prototype.forceUnclickable = function(set) {
  if (set !== undefined) {
    this._forceUnclickable = set;
    return this;
  }
  return this._forceUnclickable;
};

Device.prototype.getRenderColor = function() {
  var base = this.inhabited()?
    {r: 100, g: 255, b: 100}:
    {r: 100, g: 100, b: 100};
  if (!this.selected) {
    return base;
  }
  return {
    r: Math.floor((base.r + 255) * 0.8),
    g: Math.floor((base.g + 255) * 0.8),
    b: Math.floor((base.b + 255) * 0.8)
  };
};

Device.prototype.getRenderThicknessExterior = function() {
  return 0.5
};

Device.prototype.getRenderThicknessInterior = function() {
  return 1;
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

Device.prototype.getYCutoff = function() {
  return this.circle.y + this.circle.radius + 10;
};

Device.prototype.handleClick = function() {
  this.select();
};

Device.prototype.inhabited = function(set) {
  if (set !== undefined) {
    this._inhabited = set;
    return this;
  }
  return this._inhabited;
};

Device.prototype.isClicked = function () {
  return (
    !this.forceUnclickable() &&
    this.isHovered() &&
    this.gameEnv.game.input.activePointer.isDown
  );
};

Device.prototype.isHovered = function () {
  return this.circle && this.circle.contains(
    this.gameEnv.game.input.mousePointer.x,
    this.gameEnv.game.input.mousePointer.y
  );
};

Device.prototype.isPointerNearExternalRail = function() {
  return (
    this.gameEnv.game.input.mousePointer.y >= this.getYCutoff() &&
    this.gameEnv.game.input.mousePointer.x >= rails.outX - 30
  );
};

Device.prototype.render = function (x, y) {
  this.circle = new Phaser.Circle(
    Math.floor(x) + 0.5,
    Math.floor(y) + 0.5,
    50
  );
  _.invoke(this.expandoCircles, 'render');
  if (this.selected || (this.isHovered() && !this.forceUnclickable())) {
    var fillColor = this.getRenderFillColor();
    this.gameEnv.renderCircle(
      this.circle,
      this.getRenderThicknessExterior(),
      fillColor.r, fillColor.g, fillColor.b, true
    );
  }
  var color = this.getRenderColor();
  this.gameEnv.renderCircle(
    this.circle,
    this.getRenderThicknessExterior(), color.r, color.g, color.b
  );
  this.renderConnectionFormLine();
};

Device.prototype.renderConnectionFormLine = function() {
  var mouseY = Math.floor(this.gameEnv.game.input.mousePointer.y) + 0.5;
  if ((!this.selected) || mouseY < this.getYCutoff()) {
    return;
  }
  var mouseX = Math.floor(this.gameEnv.game.input.mousePointer.x) + 0.5;
  var nearExternalRail = this.isPointerNearExternalRail();
  if (nearExternalRail) {
    mouseX = rails.outX;
  }
  var verticalLine = new Phaser.Line(
    this.circle.x,
    this.circle.y + this.circle.radius,
    this.circle.x,
    mouseY
  );
  var horizontalLine = new Phaser.Line(this.circle.x, mouseY, mouseX, mouseY);
  var midBead = new Phaser.Circle(this.circle.x, mouseY, 3);
  var endBead = new Phaser.Circle(
    mouseX, mouseY,
    nearExternalRail? 9: 3
  );
  var color = this.getRenderColor();
  this.gameEnv.renderLine(verticalLine, 0.5, color.r, color.g, color.b);
  this.gameEnv.renderLine(horizontalLine, 0.5, color.r, color.g, color.b);
  this.gameEnv.renderCircle(midBead, 0.5, color.r, color.g, color.b, true);
  this.gameEnv.renderCircle(endBead, 0.5, color.r, color.g, color.b, true);
};

Device.prototype.select = function() {
  if (!this.selected) {
    this.deviceManager.deselectAll();
    this.selected = true;
    this.addExpandoCircle();
  }
};

Device.prototype.update = function () {
  if (this.isClicked()) {
    this.handleClick();
  } else if (this.gameEnv.game.input.activePointer.isDown) {
    this.deselect();
  }
  this.updateExpandoCircles();
};

Device.prototype.updateExpandoCircles = function () {
  this.expandoCircles = _.filter(this.expandoCircles, function (c) {
    return !c.dead;
  });
  _.invoke(this.expandoCircles, 'update');
};

function PCDevice(gameEnv, deviceManager) {
  Device.call(this, gameEnv, deviceManager);
}
PCDevice.prototype = Object.create(Device.prototype);
PCDevice.prototype.constructor = PCDevice;

PCDevice.prototype.render = function (x, y) {
  Device.prototype.render.call(this, x, y);
  var color = this.getRenderColor();
  this.gameEnv.renderRect(
    x - 12.5, y - 16.5, 25, 20,
    this.getRenderThicknessInterior(), color.r, color.g, color.b
  );
  this.gameEnv.renderRect(
    x - 16.5, y + 3.5, 33, 10,
    this.getRenderThicknessInterior(), color.r, color.g, color.b
  );
};

function USBStorageDevice(gameEnv, deviceManager) {
  Device.call(this, gameEnv, deviceManager);
}
USBStorageDevice.prototype = Object.create(Device.prototype);
USBStorageDevice.prototype.constructor = USBStorageDevice;

USBStorageDevice.prototype.render = function (x, y) {
  Device.prototype.render.call(this, x, y);
  var color = this.getRenderColor();
  this.gameEnv.renderRect(
    x - 18.5, y - 8, 30, 16,
    this.getRenderThicknessInterior(), color.r, color.g, color.b
  );
  this.gameEnv.renderRect(
    x + 11.5, y - 5, 8, 10,
    this.getRenderThicknessInterior(), color.r, color.g, color.b
  );
};
