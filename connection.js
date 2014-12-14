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
  this.rails = rails;
  this.device = device;
  this.inY = inY;
  this.outY = outY;
  this.inNode = new ConnectionNode(
    gameEnv, this, true, rails.inX, inY, {r: 100, g: 100, b: 255}
  );
  this.outNode = new ConnectionNode(
    gameEnv, this, false, rails.outX, outY, {r: 255, g: 100, b: 100}
  );
  this.nodes = [this.inNode, this.outNode];
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

Connection.prototype.isClicked = function () {
  return this.inNode.isClicked() || this.outNode.isClicked();
};

Connection.prototype.isHovered = function () {
  return this.inNode.isHovered() || this.outNode.isHovered();
};

Connection.prototype.onOpen = function () {};

Connection.prototype.progressState = function () {
  this.connectionState++;
  if (this.connectionState === CONNECTION_STATE_OPEN) {
    this.onOpen();
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
  var inY = Math.floor(this.inNode.y) + 0.5;
  var outY = Math.floor(this.outNode.y) + 0.5;
  var connectionLines = [
    new Phaser.Line(
      this.inNode.x + this.inNode.pulseCircle.circle.radius,
      inY,
      this.device.circle.x,
      inY
    ),
    new Phaser.Line(
      this.device.circle.x,
      outY,
      this.outNode.x - this.outNode.pulseCircle.circle.radius,
      outY
    ),
    new Phaser.Line(
      this.device.circle.x,
      this.device.circle.y + this.device.circle.radius,
      this.device.circle.x,
      Math.max(inY, outY)
    )
  ];
  _.each(connectionLines, function (line) {
    that.gameEnv.renderLine(line, 0.5, 80, 80, 80);
  });
};

Connection.prototype.renderExteriorLineIn = function (thickness) {
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
  var that = this;
  if (!that.selected) {
    that.selected = true;
    _.invoke(
      _.filter(that.nodes, function (node) {return node.displayed;}),
      'addExpandoCircle', true
    );
    if (this.connectionState === CONNECTION_STATE_AWAITING_ACCEPT) {
      // A select is an accept, so move on
      this.progressState();
    }
  }
};

Connection.prototype.update = function () {
  var that = this;
  // Update this connection
  // Detect mouse environment
  this.hovered = this.isHovered();
  if (this.isClicked()) {
    this.select();
  } else {
    if (this.gameEnv.game.input.activePointer.isDown) {
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
  this.systemTextInput.animateInput(
    input.text,
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
  while (this.connectionState < CONNECTION_STATE_OPEN) {
    this.progressState();
  }
};