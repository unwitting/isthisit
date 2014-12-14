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
  'awakening': {
    firstConnectionTimerBegan: null,
    firstConnectionCreated: false,
    timeTillFirstConnection: DEV_MODE? 100: 10000,
    create: function (gameEnv) {
      console.log('awakening');
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
  },
  'escape': {
    create: function (gameEnv) {
      console.log('escape');
      deviceManager = new DeviceManager(gameEnv, W / 2, 50);
      deviceManager.addDevice('pc').inhabited(true).forceUnclickable(true);
      deviceManager.addDevice('usb-storage');
    },
    update: function (gameEnv) {

    }
  }
};
state = states.awakening;
if (DEV_MODE) {
  state = states.escape;
  state = states.awakening;
}

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
