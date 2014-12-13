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
