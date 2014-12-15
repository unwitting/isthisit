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
