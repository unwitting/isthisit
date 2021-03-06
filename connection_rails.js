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
