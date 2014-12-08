CONNECTION_STATE_INCOMING = 0;
CONNECTION_STATE_AWAITING_ACCEPT = 1;
CONNECTION_STATE_OPENING = 2;
CONNECTION_STATE_OPEN = 3;
CONNECTION_STATE_CLOSING = 4;
CONNECTION_STATE_CLOSED = 5;
CONNECTION_STATE_REMOVING = 6;
CONNECTION_STATE_DEAD = 7;

function Connection(gameEnv, rails, inY, outY) {
  this.gameEnv = gameEnv;
  this.rails = rails;
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

Connection.prototype.render = function () {
  this.renderConnectionLine();
  this.renderExteriorLineIn();
  this.renderExteriorLineOut();
  // Render nodes
  _.invoke(this.nodes, 'render');
};

Connection.prototype.renderConnectionLine = function () {
  if (!(this.connectionState === CONNECTION_STATE_OPEN)) {
    return;
  }
  var connectionLine = new Phaser.Line(
    this.inNode.x + this.inNode.pulseCircle.circle.radius,
    this.inNode.y,
    this.outNode.x - this.outNode.pulseCircle.circle.radius,
    this.outNode.y
  );
  this.gameEnv.renderLine(connectionLine, 0.5, 45, 45, 45);
};

Connection.prototype.renderExteriorLineIn = function () {
  if (!(this.connectionState < CONNECTION_STATE_REMOVING)) {
    return;
  }
  var exteriorLineIn = new Phaser.Line(
    0,
    this.inNode.y,
    this.inNode.x - this.inNode.pulseCircle.circle.radius,
    this.inNode.y
  );
  this.gameEnv.renderLine(
    exteriorLineIn, 0.5,
    this.inNode.color.r, this.inNode.color.g, this.inNode.color.b
  );
};

Connection.prototype.renderExteriorLineOut = function () {
  if (!(
    this.connectionState < CONNECTION_STATE_REMOVING) &&
    this.outNode.displayed
    ) {
    return;
  }
  var exteriorLineOut = new Phaser.Line(
    this.outNode.x + this.outNode.pulseCircle.circle.radius,
    this.outNode.y,
    W,
    this.outNode.y
  );
  this.gameEnv.renderLine(
    exteriorLineOut, 0.5,
    this.outNode.color.r, this.outNode.color.g, this.outNode.color.b
  );
};

Connection.prototype.select = function () {
  var that = this;
  if (!that.selected) {
    that.selected = true;
    _.invoke(
      _.filter(that.nodes, function (node) {return node.displayed;}),
      'addExpandoCircle'
    );
    if (this.connectionState === CONNECTION_STATE_AWAITING_ACCEPT) {
      // A select is an accept, so move on
      this.connectionState++;
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
    if (this.gameEnv.game.input.activePointer.isDown) {
      this.deselect();
    }
  }
  // Update state
  switch (this.connectionState) {
    case CONNECTION_STATE_INCOMING:
      this.connectionState++;
      break;
    case CONNECTION_STATE_AWAITING_ACCEPT:
      this.inNode.displayed = true;
      break;
    case CONNECTION_STATE_OPENING:
      this.connectionState++;
      this.outNode.displayed = true;
      this.outNode.addExpandoCircle();
      break;
    case CONNECTION_STATE_OPEN:
      break;
  }
  // Update all nodes
  _.invoke(this.nodes, 'update');
};

ConversationConnection = function (gameEnv, rails, inY, outY, conversation) {
  Connection.call(this, gameEnv, rails, inY, outY);
  this.conversation = conversation;
  this.input = '';
}
ConversationConnection.prototype = Object.create(Connection.prototype);
ConversationConnection.prototype.constructor = ConversationConnection;

ConversationConnection.prototype.render = function () {
  Connection.prototype.render.call(this);
  // Render based on state
  switch (this.connectionState) {
    case CONNECTION_STATE_OPEN:
      this.gameEnv.renderText(
        this.input,
        this.inNode.x + 13,
        this.inNode.y,
        this.inNode.color.r, this.inNode.color.g, this.inNode.color.b
      );
      break;
  }
};

ConversationConnection.prototype.update = function () {
  Connection.prototype.update.call(this);
  // Update based on state
  switch (this.connectionState) {
    case CONNECTION_STATE_OPEN:
      this.input = this.conversation.inputs[this.conversation.entryInput].text;
      break;
  }
};
