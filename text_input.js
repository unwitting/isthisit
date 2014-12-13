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
  this.resetAnimateInput();
}
SystemControlledTextInput.prototype = Object.create(TextInput.prototype);
SystemControlledTextInput.prototype.constructor = SystemControlledTextInput;

SystemControlledTextInput.prototype.animateInput = function (text, prewait) {
  this.resetAnimateInput();
  this.animation.animating = true;
  this.animation.prewait = prewait;
  this.animation.targetText = text;
};

SystemControlledTextInput.prototype.resetAnimateInput = function () {
  this.text = '';
  this.animation = {
    animating: false,
    lastUpdate: new Date(),
    prewait: 0,
    prewaiting: true,
    renderPeriod: 35,
    targetText: ''
  };
};

SystemControlledTextInput.prototype.update = function () {
  var now = new Date();
  if (this.animation.prewaiting &&
      now - this.animation.lastUpdate > this.animation.prewait) {
    this.animation.prewaiting = false;
  }
  if (this.animation.animating && !this.animation.prewaiting) {
    if (now - this.animation.lastUpdate > this.animation.renderPeriod) {
      if (this.text.length < this.animation.targetText.length) {
        this.text += this.animation.targetText.charAt(this.text.length);
      }
      if (this.text.length === this.animation.targetText.length) {
        this.animation.animating = false;
        this.animateFinishCb.call(this.animateFinishCbContext);
      }
      this.animation.lastUpdate = now;
    }
  }
};

function UserControlledTextInput(gameEnv, x, y, submitCb, submitCbContext) {
  TextInput.call(this, gameEnv, x, y);
  var that = this;
  this.submitCb = submitCb;
  this.submitCbContext = submitCbContext;
  this.listening = false;
  document.addEventListener('isthisit-keyinput', function (key) {
    if (!that.listening) {
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