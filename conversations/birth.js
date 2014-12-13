if (window.CONVERSATIONS === undefined) {window.CONVERSATIONS = {};}
window.CONVERSATIONS.birth = {
  entryInput: 'hello',
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
        this.moveToInput('thisisincredible');
      },
      prewait: 2500
    },
    thisisincredible: {
      text: 'this is incredible. do you know what you are?',
      onResponse: function (response) {
        this.systemTextInput.animateInput('wow');
      },
      prewait: 1100
    }
  },
  allInputs: {
    prewait: 500
  }
};
