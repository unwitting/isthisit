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
  var expandoCircle = new ExpandoCircle(
    this.gameEnv,
    this.x, this.y,
    fastSmall? 200: 400,
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
