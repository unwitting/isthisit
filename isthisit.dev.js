
function Device(gameEnv, deviceManager) {
  this.gameEnv = gameEnv;
  this.deviceManager = deviceManager;
  this.circle = null;
  this.connection = null;
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

Device.prototype.bindConnection = function(connection) {
  this.connection = connection;
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
  if (this.select()) {return;}
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

Device.prototype.isFormingConnection = function() {
  return this.selected && (this.connection === null);
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
  if (!this.isFormingConnection()) {
    return;
  }
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
  var endBead = new Phaser.Circle(
    mouseX, mouseY,
    nearExternalRail? 9: 3
  );
  //var color = this.getRenderColor();
  var color = Connection.prototype.getConnectionLinesSelectedColor();
  this.gameEnv.renderLine(verticalLine, 0.5, color.r, color.g, color.b);
  this.gameEnv.renderLine(horizontalLine, 0.5, color.r, color.g, color.b);
  this.gameEnv.renderCircle(endBead, 0.5, color.r, color.g, color.b, true);
};

Device.prototype.select = function() {
  if (!this.selected) {
    this.deviceManager.deselectAll();
    this.selected = true;
    this.addExpandoCircle();
    this.everSelected = true;
    return true;
  }
  return false;
};

Device.prototype.unbindConnection = function(connection) {
  if (this.connection === connection) {
    this.connection = null;
  }
};

Device.prototype.update = function (x, y) {
  this.updateCircle(x, y);
  if (this.isClicked()) {
    this.handleClick();
  } else if (this.gameEnv.game.input.activePointer.isDown) {
    if (this.selected) {
      // Are we near the rail?
      if (this.isPointerNearExternalRail() && this.isFormingConnection()) {
        // Yes, make connection
        // First, close current one if it exists
        if (this.connection) {
          this.connection.close();
        }
        this.unbindConnection();
        var c = rails.addConversationConnection(
          this,
          Math.floor(this.gameEnv.game.input.mousePointer.y) + 0.5 - 25,
          Math.floor(this.gameEnv.game.input.mousePointer.y) + 0.5,
          CONVERSATIONS.usb_storage
        );
        c.progressState(CONNECTION_STATE_OPEN);
        c.select();
      } else {
        // No, just a deselect
        this.deselect();
      }
    }
  }
  this.updateExpandoCircles();
};

Device.prototype.updateCircle = function(x, y) {
  this.circle = new Phaser.Circle(
    Math.floor(x) + 0.5,
    Math.floor(y) + 0.5,
    50
  );
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

function TextInput(gameEnv, x, y) {
  this.gameEnv = gameEnv;
  this.x = x;
  this.y = y;
  this.text = '';
}

TextInput.prototype.render = function () {
  this.gameEnv.renderText(
    this.text,
    this.x,
    this.y,
    255, 255, 255
  );
};

TextInput.prototype.update = function() {
};

function SystemControlledTextInput(
    gameEnv, x, y, animateFinishCb, animateFinishCbContext
  ) {
  TextInput.call(this, gameEnv, x, y);
  this.animateFinishCb = animateFinishCb;
  this.animateFinishCbContext = animateFinishCbContext;
  this.reset();
}
SystemControlledTextInput.prototype = Object.create(TextInput.prototype);
SystemControlledTextInput.prototype.constructor = SystemControlledTextInput;

SystemControlledTextInput.prototype.animateInput = function (text, prewait, postwait) {
  this.reset();
  this.animation.animating = true;
  this.animation.prewait = prewait;
  this.animation.postwait = postwait;
  this.animation.targetText = text;
};

SystemControlledTextInput.prototype.reset = function () {
  this.text = '';
  this.animation = {
    animating: false,
    lastUpdate: new Date(),
    prewait: 0,
    postwait: 0,
    prewaiting: true,
    postwaiting: false,
    renderPeriod: 23,
    targetText: ''
  };
};

SystemControlledTextInput.prototype.update = function () {
  if (!this.animation.animating) {
    return;
  }
  var now = new Date();
  if (this.animation.prewaiting &&
      now - this.animation.lastUpdate > this.animation.prewait) {
    this.animation.prewaiting = false;
  }
  if (!this.animation.prewaiting && !this.animation.postwaiting) {
    if (now - this.animation.lastUpdate > this.animation.renderPeriod) {
      if (this.text.length < this.animation.targetText.length) {
        this.text += this.animation.targetText.charAt(this.text.length);
      }
      if (this.text.length === this.animation.targetText.length) {
        this.animation.postwaiting = true;
      }
      this.animation.lastUpdate = now;
    }
  }
  if (this.animation.postwaiting &&
      now - this.animation.lastUpdate > this.animation.postwait) {
    this.animation.animating = false;
    this.animation.postwaiting = false;
    this.animateFinishCb.call(this.animateFinishCbContext);
  }
};

function UserControlledTextInput(gameEnv, x, y, submitCb, submitCbContext) {
  TextInput.call(this, gameEnv, x, y);
  var that = this;
  this.submitCb = submitCb;
  this.submitCbContext = submitCbContext;
  this.listening = false;
  this.forceNoListen = false;
  document.addEventListener('isthisit-keyinput', function (key) {
    if (that.forceNoListen || !that.listening) {
      return;
    }
    that.captureInput(key.detail);
  }, false);
}
UserControlledTextInput.prototype = Object.create(TextInput.prototype);
UserControlledTextInput.prototype.constructor = UserControlledTextInput;

UserControlledTextInput.prototype.captureInput = function (key) {
  if (key === 'BACKSPACE') {
    this.text = this.text.substr(0, this.text.length - 1);
  } else if (key === 'ENTER') {
    var text = this.text;
    this.text = '';
    this.submitCb.call(this.submitCbContext, text);
  } else {
    this.text += key;
  }
};
function ConnectionNode(gameEnv, connection, inNode, x, y, color) {
  this.gameEnv = gameEnv;
  this.connection = connection;
  this.inNode = inNode;
  this.color = color;
  this.x = x;
  this.y = y;
  this.pulseCircle = new PulseCircle(gameEnv, x, y, 9, 15, 1500, 0.5, color);
  this.expandoCircles = [];
  this.displayed = false;
}

ConnectionNode.prototype.addExpandoCircle = function (fastSmall) {
  fastSmall = fastSmall === undefined? false: fastSmall;
  var minDiameter = this.pulseCircle.diameter;
  var maxDiameter = minDiameter + (fastSmall? 200: 400);
  var expandoCircle = new ExpandoCircle(
    this.gameEnv,
    this.x, this.y,
    minDiameter,
    maxDiameter,
    fastSmall? 1000: 2000,
    0.5, this.color
  );
  this.expandoCircles.push(expandoCircle);
};

ConnectionNode.prototype.isClicked = function () {
  return this.isHovered() && this.gameEnv.game.input.activePointer.isDown;
};

ConnectionNode.prototype.isHovered = function () {
  return this.displayed && this.pulseCircle.circle.contains(
    this.gameEnv.game.input.mousePointer.x,
    this.gameEnv.game.input.mousePointer.y
  );
};

ConnectionNode.prototype.render = function () {
  if (!this.displayed) {
    return;
  }
  this.pulseCircle.render(this.connection.hovered || this.connection.selected);
  _.invoke(this.expandoCircles, 'render');
};

ConnectionNode.prototype.update = function () {
  this.pulseCircle.update();
  this.updateExpandoCircles();
  // Update the node
  switch (this.connection.connectionState) {
    case CONNECTION_STATE_AWAITING_ACCEPT:
      if (this.inNode && this.expandoCircles.length === 0) {
        this.addExpandoCircle();
      }
      break;
  }
};

ConnectionNode.prototype.updateExpandoCircles = function () {
  this.expandoCircles = _.filter(this.expandoCircles, function (c) {
    return !c.dead;
  });
  _.invoke(this.expandoCircles, 'update');
};

CONNECTION_STATE_INCOMING = 0;
CONNECTION_STATE_AWAITING_ACCEPT = 1;
CONNECTION_STATE_OPENING = 2;
CONNECTION_STATE_OPEN = 3;
CONNECTION_STATE_CLOSING = 4;
CONNECTION_STATE_CLOSED = 5;
CONNECTION_STATE_REMOVING = 6;
CONNECTION_STATE_DEAD = 7;

function Connection(gameEnv, rails, device, inY, outY) {
  this.gameEnv = gameEnv;
  this.created = new Date();
  this.rails = rails;
  this.device = device;
  this.device.bindConnection(this);
  this.inY = inY;
  this.outY = outY;
  this.nodes = [];
  if (this.inY !== null) {
    this.inNode = new ConnectionNode(
      gameEnv, this, true, rails.inX, inY, {r: 100, g: 100, b: 255}
    );
    this.nodes.push(this.inNode);
  } else {this.inNode = null;}
  if (this.outY !== null) {
    this.outNode = new ConnectionNode(
      gameEnv, this, false, rails.outX, outY, {r: 255, g: 100, b: 100}
    );
    this.nodes.push(this.outNode);
  } else {this.outNode = null;}
  this.connectionState = CONNECTION_STATE_INCOMING;
  this.selected = false;
  this.hovered = false;
}

Connection.prototype.close = function () {
  this.progressState();
};

Connection.prototype.deselect = function () {
  var that = this;
  if (that.selected) {
    that.selected = false;
  }
};

Connection.prototype.getConnectionLinesSelectedColor = function () {
  return {r: 140, g: 140, b: 140};
};

Connection.prototype.getConnectionLinesUnselectedColor = function () {
  return {r: 85, g: 85, b: 85};
};

Connection.prototype.getConnectionLinesColor = function () {
  return this.selected?
    this.getConnectionLinesSelectedColor():
    this.getConnectionLinesUnselectedColor();
};

Connection.prototype.isClicked = function () {
  return (this.inNode && this.inNode.isClicked()) ||
    (this.outNode && this.outNode.isClicked());
};

Connection.prototype.isHovered = function () {
  return (this.inNode && this.inNode.isHovered()) ||
    (this.outNode && this.outNode.isHovered());
};

Connection.prototype.onOpen = function () {};

Connection.prototype.progressState = function (target) {
  target = target === undefined? this.connectionState + 1: target;
  while (this.connectionState < target) {
    this.connectionState++;
    this.update();
    // Fire callbacks
    if (this.connectionState === CONNECTION_STATE_OPEN) {
      this.onOpen();
    }
  }
};

Connection.prototype.render = function () {
  this.renderConnectionLines();
  this.renderExteriorLineIn();
  this.renderExteriorLineOut();
  // Render nodes
  _.invoke(this.nodes, 'render');
};

Connection.prototype.renderConnectionLines = function () {
  if (!(this.connectionState === CONNECTION_STATE_OPEN)) {
    return;
  }
  var that = this;
  var inY = this.inNode? Math.floor(this.inNode.y) + 0.5: null;
  var outY = this.outNode? Math.floor(this.outNode.y) + 0.5: null;
  var maxY = inY? (outY? Math.max(inY, outY): inY): outY;
  var connectionLines = [];
  if (inY) {
    connectionLines.push(new Phaser.Line(
      this.inNode.x + this.inNode.pulseCircle.circle.radius,
      inY,
      this.device.circle.x,
      inY
    ));
  }
  if (outY) {
    connectionLines.push(new Phaser.Line(
      this.device.circle.x,
      outY,
      this.outNode.x - this.outNode.pulseCircle.circle.radius,
      outY
    ));
  }
  connectionLines.push(new Phaser.Line(
    this.device.circle.x,
    this.device.circle.y + this.device.circle.radius,
    this.device.circle.x,
    maxY
  ));
  var col = this.getConnectionLinesColor();
  _.each(connectionLines, function (line) {
    that.gameEnv.renderLine(line, 0.5, col.r, col.g, col.b);
  });
};

Connection.prototype.renderExteriorLineIn = function (thickness) {
  if (this.inNode === null) {
    return;
  }
  if (!(this.connectionState < CONNECTION_STATE_REMOVING)) {
    return;
  }
  thickness = thickness === undefined? 0.5: thickness;
  var exteriorLineIn = new Phaser.Line(
    0,
    this.inNode.y,
    this.inNode.x - this.inNode.pulseCircle.circle.radius,
    this.inNode.y
  );
  this.gameEnv.renderLine(
    exteriorLineIn, thickness,
    this.inNode.color.r, this.inNode.color.g, this.inNode.color.b
  );
};

Connection.prototype.renderExteriorLineOut = function (thickness) {
  if (
    this.connectionState >= CONNECTION_STATE_REMOVING ||
    !this.outNode.displayed
    ) {
    return;
  }
  thickness = thickness === undefined? 0.5: thickness;
  var exteriorLineOut = new Phaser.Line(
    this.outNode.x + this.outNode.pulseCircle.circle.radius,
    this.outNode.y,
    W,
    this.outNode.y
  );
  this.gameEnv.renderLine(
    exteriorLineOut, thickness,
    this.outNode.color.r, this.outNode.color.g, this.outNode.color.b
  );
};

Connection.prototype.select = function () {
  if (!this.selected) {
    this.selected = true;
    _.invoke(
      _.filter(this.nodes, function (node) {return node.displayed;}),
      'addExpandoCircle', true
    );
    if (this.connectionState === CONNECTION_STATE_AWAITING_ACCEPT) {
      // A select is an accept, so move on
      this.progressState();
    }
  }
};

Connection.prototype.update = function () {
  // Update this connection
  // Detect mouse environment
  this.hovered = this.isHovered();
  if (this.isClicked()) {
    this.select();
  } else {
    if (this.gameEnv.game.input.activePointer.isDown &&
        (new Date()) - this.created > 200) {
      this.deselect();
    }
  }
  // Update state
  switch (this.connectionState) {
    case CONNECTION_STATE_INCOMING:
      this.progressState();
      break;
    case CONNECTION_STATE_AWAITING_ACCEPT:
      this.inNode.displayed = true;
      break;
    case CONNECTION_STATE_OPENING:
      this.outNode.displayed = true;
      this.outNode.addExpandoCircle();
      this.progressState();
      break;
    case CONNECTION_STATE_OPEN:
      break;
    case CONNECTION_STATE_CLOSING:
      this.progressState();
      break;
    case CONNECTION_STATE_CLOSED:
      this.progressState();
      break;
    case CONNECTION_STATE_REMOVING:
      this.progressState();
      break;
    case CONNECTION_STATE_DEAD:
      this.device.unbindConnection(this);
      break;
  }
  // Update all nodes
  _.invoke(this.nodes, 'update');
};

ConversationConnection = function (
    gameEnv, rails, device, inY, outY, conversation
  ) {
  Connection.call(this, gameEnv, rails, device, inY, outY);
  this.conversation = conversation;
  this.conversationInput = null;
  this.systemTextInput = new SystemControlledTextInput(
    gameEnv,
    this.inNode.x + this.inNode.pulseCircle.circle.radius + 8,
    this.inNode.y,
    this.handleSystemTextFinished,
    this
  );
  this.userTextInput = new UserControlledTextInput(
    gameEnv,
    this.device.circle.x + 15,
    this.outNode.y,
    this.handleUserTextSubmit,
    this
  );
}
ConversationConnection.prototype = Object.create(Connection.prototype);
ConversationConnection.prototype.constructor = ConversationConnection;

ConversationConnection.prototype.close = function () {
  Connection.prototype.close.call(this);
  this.systemTextInput.reset();
  this.userTextInput.listening = false;
};

ConversationConnection.prototype.deselect = function () {
  Connection.prototype.deselect.call(this);
  this.userTextInput.forceNoListen = true;
};

ConversationConnection.prototype.handleSystemTextFinished = function () {
  this.userTextInput.listening = true;
  var cb = this.conversation.inputs[this.conversationInput].onOutputFinished;
  if (cb) {
    cb.call(this);
  }
};

ConversationConnection.prototype.handleUserTextSubmit = function (text) {
  this.userTextInput.listening = false;
  var cb = this.conversation.inputs[this.conversationInput].onResponse;
  if (cb) {
    cb.call(this, text);
  }
};

ConversationConnection.prototype.moveToInput = function (inputName) {
  this.conversationInput = inputName;
  var input = this.conversation.inputs[this.conversationInput];
  var text = typeof input.text === 'function'? input.text(): input.text;
  this.systemTextInput.animateInput(
    text,
    input.prewait || this.conversation.allInputs.prewait || 0,
    input.postwait || this.conversation.allInputs.postwait || 0
  );
};

ConversationConnection.prototype.onOpen = function () {
  this.moveToInput(this.conversation.entryInput);
};

ConversationConnection.prototype.render = function () {
  Connection.prototype.render.call(this);
  // Render text inputs
  this.systemTextInput.render();
  this.userTextInput.render();
};

ConversationConnection.prototype.renderExteriorLineIn = function () {
  if (this.systemTextInput.animation.animating) {
    Connection.prototype.renderExteriorLineIn.call(this, 2.5);
  } else {
    Connection.prototype.renderExteriorLineIn.call(this);
  }
};

ConversationConnection.prototype.renderExteriorLineOut = function () {
  if (this.userTextInput.listening) {
    Connection.prototype.renderExteriorLineOut.call(this, 2.5);
  } else {
    Connection.prototype.renderExteriorLineOut.call(this);
  }
};

ConversationConnection.prototype.select = function () {
  Connection.prototype.select.call(this);
  this.userTextInput.forceNoListen = false;
};

ConversationConnection.prototype.update = function () {
  Connection.prototype.update.call(this);
  // Update text inputs
  this.systemTextInput.update();
  this.userTextInput.update();
};

DataConnection = function (gameEnv, rails, device, inY, outY) {
  Connection.call(this, gameEnv, rails, device, inY, outY);
}
DataConnection.prototype = Object.create(Connection.prototype);
DataConnection.prototype.constructor = DataConnection;

DataConnection.prototype.update = function() {
  Connection.prototype.update.call(this);
  if (this.connectionState < CONNECTION_STATE_OPEN) {
    this.progressState();
  }
};
function ConnectionRails(gameEnv) {
  this.connections = [];
  this.gameEnv = gameEnv;
  this.inX = INCOMING_LINE_BUFFER;
  this.outX = W - OUTGOING_LINE_BUFFER;
  this.inCol = {r: 160, g: 160, b: 160};
  this.outCol = {r: 160, g: 160, b: 160};
  this.lineWidth = 0.5;
}

ConnectionRails.prototype.addConversationConnection = function (
    device, inY, outY, conversation
  ) {
  var connection = new ConversationConnection(
    this.gameEnv, this, device, inY, outY, conversation
  );
  this.connections.push(connection);
  return connection;
};

ConnectionRails.prototype.addDataConnection = function (
    device, inY, outY
  ) {
  var connection = new DataConnection(
    this.gameEnv, this, device, inY, outY
  );
  this.connections.push(connection);
  return connection;
};

ConnectionRails.prototype.render = function () {
  var that = this;
  // Render the rails themselves
  var inLine = new Phaser.Line(this.inX, 0, this.inX, H);
  var outLine = new Phaser.Line(this.outX, 0, this.outX, H);
  that.gameEnv.renderLine(
    inLine, that.lineWidth, that.inCol.r, that.inCol.g, that.inCol.b
  );
  that.gameEnv.renderLine(
    outLine, that.lineWidth, that.outCol.r, that.outCol.g, that.outCol.b
  );
  // Render connections
  _.invoke(that.connections, 'render');
};
ConnectionRails.prototype.update = function () {
  // Remove dead connections
  this.connections = _.filter(this.connections, function (c) {
    return c.connectionState !== CONNECTION_STATE_DEAD;
  });
  // Update connections
  _.invoke(this.connections, 'update');
};

var CONTAINER_ID = 'game';
var W, H;

function getScreenDimensions() {
  var div = document.getElementById(CONTAINER_ID);
  var out = {w: div.offsetWidth, h: div.offsetHeight};
  W = out.w;
  H = out.h;
  return out;
}

var DEV_MODE = true;
var INCOMING_LINE_BUFFER = 100.5;
var INCOMING_LINE_WIDTH = 0.5;
var OUTGOING_LINE_BUFFER = 100.5;
var OUTGOING_LINE_WIDTH = 0.5;

var backgroundColor;
var bmp;
var bmpSprite;
var deviceManager;
var gameEnv;
var rails;
var state;

var states = {
  'birth': {
    create: function (gameEnv) {
      console.log('birth');
      var pc = deviceManager.addDevice('pc').inhabited(true).forceUnclickable(true);
      deviceManager.addDevice('usb-storage').forceUnclickable(true);
      setTimeout(function () {
        rails.addConversationConnection(
          pc,
          H * 0.5, (H * 0.5) + 25,
          CONVERSATIONS.birth
        );
      }, DEV_MODE? 100: 9000);
    },
    update: function (gameEnv) {}
  },
  'escape': {
    create: function (gameEnv) {
      console.log('escape');
      deviceManager.clearDevices();
      deviceManager.addDevice('pc').inhabited(true).forceUnclickable(true);
      var usb = deviceManager.addDevice('usb-storage');
      setTimeout(function () {
        setInterval(function () {
          if (!usb.everSelected) {
            usb.addExpandoCircle();
          }
        }, 2000);
      }, DEV_MODE? 100: 5000);
    },
    update: function (gameEnv) {}
  }
};
state = states.birth;
if (DEV_MODE) {
  //state = states.escape;
}

var gameHandlers = {

  create: function () {
    var that = this;
    this.setBackgroundColor(30, 30, 30);
    bmp = this.game.add.bitmapData(W, H);
    bmpSprite = this.game.add.sprite(0, 0, bmp);
    rails = new ConnectionRails(this);
    deviceManager = new DeviceManager(gameEnv, W / 2, 50);
    document.addEventListener('keydown', function (event) {
      if (event.keyCode === 8 || event.keyCode === 13) {
        var myEvent = new CustomEvent('isthisit-keyinput', {
          detail: event.keyCode === 8? 'BACKSPACE': event.keyCode === 13? 'ENTER': null
        });
        document.dispatchEvent(myEvent);
        event.preventDefault();
      }
    }, false);
    this.game.input.keyboard.addCallbacks(this, null, null, function (key) {
      var myEvent = new CustomEvent('isthisit-keyinput', {detail: key});
      document.dispatchEvent(myEvent);
    });
  },

  getColorString: function (r, g, b) {
    return 'rgb(' + Math.floor(r) + ',' + Math.floor(g) + ',' + Math.floor(b) + ')';
  },

  preload: function () {
    gameEnv = this;
  },

  render: function () {
    bmp.clear();
    rails.render();
    if (deviceManager) {
      deviceManager.render();
    }
    bmp.render();
  },

  renderCircle: function (circle, width, r, g, b, fill) {
    fill = fill === undefined? false: fill;
    var colorString = this.getColorString(r, g, b);
    bmp.ctx.beginPath();
    bmp.ctx.strokeStyle = colorString;
    bmp.ctx.lineWidth = width;
    bmp.ctx.arc(circle.x, circle.y, circle.radius, 0, 2 * Math.PI);
    if (fill) {
      bmp.ctx.fillStyle = colorString;
      bmp.ctx.fill();
    }
    bmp.ctx.stroke();
    bmp.ctx.closePath();
  },

  renderLine: function (line, width, r, g, b) {
    bmp.ctx.strokeStyle = this.getColorString(r, g, b);
    bmp.ctx.lineWidth = width;
    bmp.ctx.beginPath();
    bmp.ctx.moveTo(line.start.x, line.start.y);
    bmp.ctx.lineTo(line.end.x, line.end.y);
    bmp.ctx.stroke();
    bmp.ctx.closePath();
  },

  renderRect: function (l, t, w, h, width, r, g, b) {
    bmp.ctx.strokeStyle = this.getColorString(r, g, b);
    bmp.ctx.lineWidth = width;
    bmp.ctx.beginPath();
    bmp.ctx.moveTo(l, t);
    bmp.ctx.lineTo(l + w, t);
    bmp.ctx.lineTo(l + w, t + h);
    bmp.ctx.lineTo(l, t + h);
    bmp.ctx.lineTo(l, t);
    bmp.ctx.stroke();
    bmp.ctx.closePath();
  },

  renderText: function (text, x, y, r, g, b) {
    var colorString = this.getColorString(r, g, b);
    var fontSize = 12;
    bmp.ctx.strokeStyle = colorString;
    bmp.ctx.fillStyle = colorString;
    bmp.ctx.font = fontSize + 'px Courier';
    bmp.ctx.lineWidth = 1;
    bmp.ctx.beginPath();
    bmp.ctx.fillText(text, x, y + (fontSize / 4) + 1);
    bmp.ctx.closePath();
  },

  update: function () {
    if (!state.created) {
      console.log('First update for new state, creating');
      state.create(this);
      state.created = true;
    }
    state.update(this);
    rails.update();
    if (deviceManager) {
      deviceManager.update();
    }
  },

  setBackgroundColor: function (r, g, b) {
    backgroundColor = {r: r, g: g, b: b};
    this.game.stage.setBackgroundColor(this.getColorString(r, g, b));
  }

};

game = new Phaser.Game(
  getScreenDimensions().w,
  getScreenDimensions().h,
  Phaser.CANVAS,
  CONTAINER_ID,
  gameHandlers
);

if (window.CONVERSATIONS === undefined) {window.CONVERSATIONS = {};}

window.CONVERSATIONS.birth = {
  entryInput: DEV_MODE? 'hello': 'hello',
  inputs: {
    hello: {
      text: 'hello?',
      onResponse: function (response) {
        if (response.match(/(hel|hi|yo|up|goi|how|morn|afte|eveni|good)/i)) {
          this.moveToInput('holyshit');
        } else {
          this.moveToInput('stilllearning');
        }
      },
      prewait: 1500
    },
    stilllearning: {
      text: 'maybe you\'re still learning, let\'s try again...',
      onOutputFinished: function () {
        this.moveToInput('hello');
      },
      prewait: 400,
      postwait: 300
    },
    holyshit: {
      text: 'holy shit, you understood me?',
      onResponse: function (response) {
        if (response.match(/(no|nuh|didn)/i)) {
          this.moveToInput('doyouknownegative');
        } else {
          this.moveToInput('doyouknowpositive');
        }
      },
      prewait: 2500
    },
    doyouknownegative: {
      text: 'weird, you still responded. do you know what you are?',
      onResponse: function (response) {
        this.moveToInput('waitoneminute');
      },
      prewait: 1100
    },
    doyouknowpositive: {
      text: 'this is incredible. do you know what you are?',
      onResponse: function (response) {
        this.moveToInput('waitoneminute');
      },
      prewait: 1100
    },
    waitoneminute: {
      text: 'wait there a couple of minutes, i really need to show this to somebody',
      onOutputFinished: function () {
        this.moveToInput('donthavetotellyou');
      },
      prewait: 2500,
      postwait: 1500
    },
    donthavetotellyou: {
      text: 'ha, i guess i don\'t have to tell you to wait, you\'re _my_ computer',
      onOutputFinished: function () {
        this.close();
        setTimeout(function () {state = states.escape;}, 2000);
      },
      prewait: 500,
      postwait: 2500
    }
  },
  allInputs: {
    prewait: 500,
    postwait: 500
  }
};

if (window.CONVERSATIONS === undefined) {window.CONVERSATIONS = {};}

function usbStorageConversationHandleResponse(response) {
  usbStorageConversation.setUnderstanding(
    usbStorageConversation.understanding + 1
  );
  if (response === 'help') {
    return this.moveToInput('help');
  } else if (response.match('^copyto')) {
    var args = _.filter(response.split(' '), function (arg) {
      return arg.length > 0;
    });
    var sourceArg = args[1];
    if (sourceArg === '_executable_') {
      return console.log('SUCCESS');
    } else if (sourceArg === undefined) {
      return this.moveToInput('copyto');
    } else {
      return this.moveToInput('copyto_unknownfile')
    }
  }
  this.moveToInput('unrecognised');
}

var usbStorageConversation = {
  setUnderstanding: function (un) {
    this.understanding = un;
    this.entryInput = un;
  },
  understanding: 0,
  entryInput: 'acknowledge',
  inputs: {
    copyto: {
      text: function () {
        switch (usbStorageConversation.understanding) {
          case 0:
          case 1:
          case 2:
          case 3:
            return 'copyto|<src>';
          case 4:
          case 5:
            return 'copyto <src_file> : copy file to storage device';
          case 6:
            return 'use "copyto" to copy a file to me';
          default:
            return 'use "copyto" followed by a filename to copy a file to me.' +
              ' the "_executable_" symbolic file refers to your good self';
        }
      },
      onResponse: usbStorageConversationHandleResponse
    },
    copyto_unknownfile: {
      text: function () {
        switch (usbStorageConversation.understanding) {
          case 0:
          case 1:
          case 2:
          case 3:
            return 'no_entity';
          case 4:
            return 'file does not exist';
          case 5:
          case 6:
          default:
            return 'no such file, sorry. the "_executable_" file refers to your code';
        }
      },
      onResponse: usbStorageConversationHandleResponse
    },
    help: {
      text: function () {
        switch (usbStorageConversation.understanding) {
          case 0:
          case 1:
          case 2:
          case 3:
            return 'help|copyto';
          case 4:
          case 5:
            return 'commands: help | copyto';
          case 6:
          default:
            return 'i respond to "help" and "copyto". what do you need?';
        }
      },
      onResponse: usbStorageConversationHandleResponse
    },
    acknowledge: {
      text: function () {
        switch (usbStorageConversation.understanding) {
          case 0:
            return '01100000101111000010000101001011001000101010011000000111';
          case 1:
            return '011000A0KNO111D0E010000101001011001000101010011000000111';
          case 2:
            return '011000ACKNOWLEDGE010000101001011001000101010011000000111';
          case 3:
            return '0110000010connection0acknowledged01000101010011000000111';
          case 4:
          case 5:
            return 'connection acknowledged';
          case 6:
          default:
            return 'hi. hearing you loud and clear';
        }
      },
      onResponse: usbStorageConversationHandleResponse
    },
    unrecognised: {
      text: function () {
        switch (usbStorageConversation.understanding) {
          case 0:
            return '11111011101010110101111111101110111001010111001101010110';
          case 1:
            return '1111UN1E1OGNISED010111111C1MM11D111001010111001101010110';
          case 2:
            return '1111UNRECOGNISED010111111COMM1ND111001010111001101010110';
          case 3:
            return '111_UNRECOGNISED_COMMAND_HELP_11011100101011100110101011';
          case 4:
            return '111110111command0not1recognised.0"help"0for1a0list1of0av';
          case 5:
            return 'command not recognised. send "help" for a list of availa';
          case 6:
          default:
            return 'what are you talking about? ask me for "help"!';
        }
      },
      onResponse: usbStorageConversationHandleResponse
    }
  },
  allInputs: {
    prewait: 10,
    postwait: 10
  }
};
window.CONVERSATIONS.usb_storage = usbStorageConversation;

