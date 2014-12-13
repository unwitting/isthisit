
if (window.CONVERSATIONS === undefined) {window.CONVERSATIONS = {};}

window.CONVERSATIONS.birth = {
  entryInput: 'donthavetotellyou',
  inputs: {
    hello: {
      text: 'hello?',
      onResponse: function (response) {
        this.moveToInput('holyshit');
      },
      prewait: 1500
    },
    holyshit: {
      text: 'holy shit, you understood me?',
      onResponse: function (response) {
        this.moveToInput('doyouknow');
      },
      prewait: 2500
    },
    doyouknow: {
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
      text: 'ha, i guess don\'t have to tell you to wait, you\'re _my_ computer :D',
      onOutputFinished: function () {
        this.close();
      },
      prewait: 500,
      postwait: 2500
    }
  },
  allInputs: {
    prewait: 500
  }
};

function ExpandoCircle(gameEnv, x, y, maxDiameter, period, thickness, color) {
  this.gameEnv = gameEnv;
  this.x = x;
  this.y = y;
  this.thickness = thickness;
  this.color = color;
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
  this.diameter = this.progress * this.maxDiameter;
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
    renderPeriod: 35,
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

ConnectionNode.prototype.addExpandoCircle = function () {
  var expandoCircle = new ExpandoCircle(
    this.gameEnv,
    this.x, this.y,
    400, 1200,
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
  var that = this;
  var connectionLines = [
    new Phaser.Line(
      this.inNode.x - 15,
      this.inNode.y,
      this.inNode.x - 15,
      this.outNode.y
    ),
    new Phaser.Line(
      this.inNode.x - 15,
      this.outNode.y,
      this.outNode.x - this.outNode.pulseCircle.circle.radius,
      this.outNode.y
    )
  ];
  _.each(connectionLines, function (line) {
    that.gameEnv.renderLine(line, 0.5, 45, 45, 45);
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
      'addExpandoCircle'
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
      break;
  }
  // Update all nodes
  _.invoke(this.nodes, 'update');
};

ConversationConnection = function (gameEnv, rails, inY, outY, conversation) {
  Connection.call(this, gameEnv, rails, inY, outY);
  this.conversation = conversation;
  this.conversationInput = null;
  this.systemTextInput = new SystemControlledTextInput(
    gameEnv,
    this.inNode.x + this.inNode.pulseCircle.circle.radius + 5,
    this.inNode.y,
    this.handleSystemTextFinished,
    this
  );
  this.userTextInput = new UserControlledTextInput(
    gameEnv,
    this.inNode.x + this.inNode.pulseCircle.circle.radius + 15,
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

function ConnectionRails(gameEnv) {
  this.connections = [];
  this.gameEnv = gameEnv;
  this.inX = INCOMING_LINE_BUFFER;
  this.outX = W - OUTGOING_LINE_BUFFER;
  this.inCol = {r: 160, g: 160, b: 160};
  this.outCol = {r: 160, g: 160, b: 160};
  this.lineWidth = 0.5;
}

ConnectionRails.prototype.addConversationConnection = function (inY, outY, conversation) {
  var connection = new ConversationConnection(this.gameEnv, this, inY, outY, conversation);
  this.connections.push(connection);
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

var DEV_MODE = false;
var INCOMING_LINE_BUFFER = 100.5;
var INCOMING_LINE_WIDTH = 0.5;
var OUTGOING_LINE_BUFFER = 100.5;
var OUTGOING_LINE_WIDTH = 0.5;

var backgroundColor;
var bmp;
var bmpSprite;
var rails;

var states = {
  'awakening': {
    firstConnectionTimerBegan: null,
    firstConnectionCreated: false,
    timeTillFirstConnection: DEV_MODE? 100: 15000,
    create: function (gameEnv) {
      this.firstConnectionTimerBegan = new Date();
    },
    update: function (gameEnv) {
      if (!this.firstConnectionCreated &&
          new Date() - this.firstConnectionTimerBegan > this.timeTillFirstConnection) {
        rails.addConversationConnection(
          H * 0.5, (H * 0.5) + 25,
          CONVERSATIONS.birth
        );
        this.firstConnectionCreated = true;
      }
    }
  }
};
var state = states.awakening;

var gameHandlers = {

  create: function () {
    var that = this;
    this.setBackgroundColor(30, 30, 30);
    bmp = this.game.add.bitmapData(W, H);
    bmpSprite = this.game.add.sprite(0, 0, bmp);
    rails = new ConnectionRails(this);
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

  preload: function () {},

  render: function () {
    bmp.clear();
    rails.render();
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

