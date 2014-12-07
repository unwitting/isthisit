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
var incomingLine;
var outgoingLine;
var incomingConnections = [];
var outgoingConnections = [];

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
        gameEnv.addIncomingConnection(new IncomingConnection(H * 0.5, gameEnv));
        this.firstConnectionCreated = true;
      }
    }
  }
};
var state = states.awakening;

var gameHandlers = {

  addIncomingConnection: function (connection) {
    incomingConnections.push(connection);
  },

  addOutgoingConnection: function (connection) {
    outgoingConnections.push(connection);
  },

  create: function () {
    console.log('create');
    this.setBackgroundColor(30, 30, 30);
    bmp = this.game.add.bitmapData(W, H);
    bmpSprite = this.game.add.sprite(0, 0, bmp);
    incomingLine = new Phaser.Line(INCOMING_LINE_BUFFER, 0, INCOMING_LINE_BUFFER, H);
    outgoingLine = new Phaser.Line(W - OUTGOING_LINE_BUFFER, 0, W - OUTGOING_LINE_BUFFER, H);
    document.addEventListener('keydown', function (event) {
      if (event.keyCode === 8 || event.keyCode === 13) {
        outgoingConnections.map(function (conn) {
          conn.attemptInput(event.keyCode === 8? 'BACKSPACE': event.keyCode === 13? 'ENTER': null);
        });
        event.preventDefault();
      }
    }, false);
    this.game.input.keyboard.addCallbacks(this, null, null, function (key) {
      outgoingConnections.map(function (conn) {
        conn.attemptInput(key);
      });
    });
  },

  getColorString: function (r, g, b) {
    return 'rgb(' + Math.floor(r) + ',' + Math.floor(g) + ',' + Math.floor(b) + ')';
  },

  preload: function () {
    console.log('preload');
  },

  render: function () {
    bmp.clear();
    this.renderLine(incomingLine, INCOMING_LINE_WIDTH, 160, 160, 160);
    this.renderLine(outgoingLine, OUTGOING_LINE_WIDTH, 160, 160, 160);
    for (var i in incomingConnections) {
      incomingConnections[i].render(this);
    }
    for (var i in outgoingConnections) {
      outgoingConnections[i].render(this);
    }
    bmp.render();
  },

  renderCircle: function (circle, width, r, g, b, fill) {
    fill = fill === undefined? false: fill;
    var colorString = this.getColorString(r, g, b);
    bmp.ctx.beginPath();
    bmp.ctx.strokeStyle = colorString;
    bmp.ctx.lineWidth = width;
    try{
      bmp.ctx.arc(circle.x, circle.y, circle.radius, 0, 2 * Math.PI);
    } catch(e) {
      console.log(e);
    }
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
    var fontSize = 15;
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
    for (var i in incomingConnections) {
      incomingConnections[i].update(this);
    }
    for (var i in outgoingConnections) {
      outgoingConnections[i].update(this);
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
