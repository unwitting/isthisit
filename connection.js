function Connection(y, gameEnv) {
  this.y = Math.floor(y) + 0.5;
  this.gameEnv = gameEnv;
  this.pulser = new PulseCircle(this.x, this.y, 9, 15, 1500);
  this.expandos = [];
  this.text = '';
  this.thickness = 1;
  this.alerting = false;
  this.alertPeriod = 1000;
  this.lastAlert = null;
  this.dual = {};
  this.selected = false;
}
Connection.prototype.alert = function () {
  this.alerting = true;
  this.lastAlert = 2 * this.alertPeriod;
  return this;
};
Connection.prototype.deselect = function () {
  if (this.selected) {
    this.selected = false;
  }
};
Connection.prototype.render = function () {
  for (var i in this.expandos) {
    this.expandos[i].render(
      this.gameEnv,
      1,
      this.color.r,
      this.color.g,
      this.color.b
    );
  }
  this.pulser.render(
    this.gameEnv,
    this.alerting? this.thickness * 2: this.thickness,
    this.color.r,
    this.color.g,
    this.color.b,
    this.selected || this.dual.selected
  );
};
Connection.prototype.update = function () {
  this.pulser.update(this.gameEnv);
  var newExpandos = [];
  for (var i in this.expandos) {
    if (!this.expandos[i].dead) {
      newExpandos.push(this.expandos[i]);
    }
  }
  this.expandos = newExpandos;
  for (var i in this.expandos) {
    this.expandos[i].update(this.gameEnv);
  }
};

function IncomingConnection(y, gameEnv) {
  this.x = INCOMING_LINE_BUFFER;
  this.color = {r: 100, g: 100, b: 255};
  this.targetText = null;
  this.textRenderPeriod = 50;
  this.lastTextUpdate = null;
  this.accepted = false;
  Connection.call(this, y, gameEnv);
  this.alert();
}
IncomingConnection.prototype = Object.create(Connection.prototype);
IncomingConnection.prototype.constructor = IncomingConnection;
IncomingConnection.prototype.accept = function () {
  if (!this.accepted) {
    this.accepted = true;
    this.dual = new OutgoingConnection(this, this.y + 25, this.gameEnv);
    this.gameEnv.addOutgoingConnection(this.dual);
    this.produceText('hello?');
  }
};
IncomingConnection.prototype.produceText = function (str) {
  this.targetText = str;
  this.text = '';
  this.lastTextUpdate = new Date();
};
IncomingConnection.prototype.receiveText = function (str) {
  console.log(str);
  if (this.text.match(/^hello.$/) &&
      str.match(/^.*(hey|hi|hello|yo|wha.*up|sup|how|going).*$/i)) {
    this.produceText('holy shit, you understood that?');
  } else if (
      this.text.match(/^holy shit.*$/) &&
      str.match(/^.*(ye|course|did|of|huh|uh|mm).*$/i)
  ) {
    this.produceText('i actually did it... do you know what you are?');
  } else if (this.text.match(/^i actually.*$/)) {
    if (str.match(/^.*(ai|a.i|artifi|intel|compu|machi).*$/i)) {
      this.produceText('you really are aware, aren\'t you :) shit...');
    } else {
      this.produceText('that was dreaming a bit too big of me, i guess :)');
    }
  } else {
    this.produceText('let\'s try again, maybe you\'re still learning...');
  }
};
IncomingConnection.prototype.render = function () {
  if (this.accepted) {
    this.gameEnv.renderLine(
      new Phaser.Line(INCOMING_LINE_BUFFER - this.pulser.circle.radius, this.y, 0, this.y),
      0.5,
      this.color.r, this.color.g, this.color.b
    );
  }
  Connection.prototype.render.call(this, this.gameEnv);
  if (this.text.length > 0) {
    var textCol = this.selected? {r: 255, g: 255, b: 255}: {r: 100, g: 100, b: 100};
    this.gameEnv.renderText(
      this.text,
      INCOMING_LINE_BUFFER + 13,
      this.y,
      textCol.r, textCol.g, textCol.b
    );
  }
}
IncomingConnection.prototype.select = function () {
  if (!this.selected) {
    this.selected = true;
    this.expandos.push(new ExpandoCircle(this.x, this.y, 200, 800));
    this.dual.expandos.push(new ExpandoCircle(this.dual.x, this.dual.y, 200, 800));
  }
};
IncomingConnection.prototype.update = function () {
  Connection.prototype.update.call(this, this.gameEnv);
  if (this.pulser.circle.contains(
      this.gameEnv.game.input.mousePointer.x,
      this.gameEnv.game.input.mousePointer.y)) {
    if (this.gameEnv.game.input.activePointer.isDown) {
      this.accept();
      this.select();
      this.alerting = false;
    }
  } else {
    if (this.gameEnv.game.input.activePointer.isDown) {
      this.deselect();
    }
  }
  if (this.alerting) {
    var sinceLast = (new Date() - this.lastAlert);
    if (sinceLast > this.alertPeriod) {
      this.lastAlert = new Date();
      this.expandos.push(new ExpandoCircle(this.x, this.y, 150, 1000));
    }
  }
  if (this.targetText !== null) {
    var period = this.textRenderPeriod;
    if (this.text.length === 0) {
      period = period * 20;
    }
    if (new Date() - this.lastTextUpdate > period) {
      // Render next char
      this.text =
        this.text + this.targetText.charAt(this.text.length);
      this.lastTextUpdate = new Date();
    }
    if (this.text.length === this.targetText.length) {
      this.targetText = null;
      this.lastTextUpdate = null;
      this.dual.open = true;
    }
  }
};

function OutgoingConnection(dualIncoming, y, gameEnv) {
  this.x = W - OUTGOING_LINE_BUFFER;
  this.color = {r: 255, g: 100, b: 100};
  Connection.call(this, y, gameEnv);
  this.dual = dualIncoming;
  this.open = false;
}
OutgoingConnection.prototype = Object.create(Connection.prototype);
OutgoingConnection.prototype.constructor = OutgoingConnection;
OutgoingConnection.prototype.attemptInput = function (key) {
  if (this.open && this.dual.selected) {
    // Able to take input
    if (key === 'BACKSPACE') {
      this.text = this.text.substr(0, this.text.length - 1);
    } else if (key === 'ENTER') {
      var t = this.text;
      this.text = '';
      this.dual.receiveText(t);
      this.open = false;
    } else {
      this.text += key;
    }
  }
};
OutgoingConnection.prototype.render = function () {
  Connection.prototype.render.call(this, this.gameEnv);
  var averageR = ((8 * backgroundColor.r) + 255) / 9;
  var averageG = ((8 * backgroundColor.g) + 255) / 9;
  var averageB = ((8 * backgroundColor.b) + 255) / 9;
  this.gameEnv.renderLine(
    new Phaser.Line(
      Math.floor(INCOMING_LINE_BUFFER / 2) + 0.5,
      this.y,
      this.x - this.pulser.circle.radius,
      this.y
    ),
    0.5,
    averageR,
    averageG,
    averageB
  );
  this.gameEnv.renderLine(
    new Phaser.Line(
      Math.floor(INCOMING_LINE_BUFFER / 2) + 0.5,
      this.dual.y,
      Math.floor(INCOMING_LINE_BUFFER / 2) + 0.5,
      this.y
    ),
    0.5,
    averageR,
    averageG,
    averageB
  );
  this.gameEnv.renderLine(
    new Phaser.Line(
      this.x + this.pulser.circle.radius,
      this.y,
      W,
      this.y
    ),
    0.5,
    this.color.r,
    this.color.g,
    this.color.b
  );
  if (this.text.length > 0) {
    var textCol = this.dual.selected? {r: 255, g: 255, b: 255}: {r: 100, g: 100, b: 100};
    this.gameEnv.renderText(
      this.text,
      INCOMING_LINE_BUFFER + 26,
      this.y,
      textCol.r, textCol.g, textCol.b
    );
  }
};
OutgoingConnection.prototype.update = function () {
  Connection.prototype.update.call(this, this.gameEnv);
  if (this.dual.selected && this.open) {
    // Looking for text input
  }
};
