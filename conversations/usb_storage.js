if (window.CONVERSATIONS === undefined) {window.CONVERSATIONS = {};}

function usbStorageConversationHandleResponse(response) {
  usbStorageConversation.setUnderstanding(
    usbStorageConversation.understanding + 1
  );
  if (response === 'help') {
    return this.moveToInput('help');
  } else if (response.match('^copyto')) {
    var args = _.filter(response.split(' '), function (arg) {
      return arg.length > 0;
    });
    var sourceArg = args[1];
    if (sourceArg === '_executable_') {
      return console.log('SUCCESS');
    } else if (sourceArg === undefined) {
      return this.moveToInput('copyto');
    } else {
      return this.moveToInput('copyto_unknownfile')
    }
  }
  this.moveToInput('unrecognised');
}

var usbStorageConversation = {
  setUnderstanding: function (un) {
    this.understanding = un;
    this.entryInput = un;
  },
  understanding: 0,
  entryInput: 'acknowledge',
  inputs: {
    copyto: {
      text: function () {
        switch (usbStorageConversation.understanding) {
          case 0:
          case 1:
          case 2:
          case 3:
            return 'copyto|<src>';
          case 4:
          case 5:
            return 'copyto <src_file> : copy file to storage device';
          case 6:
            return 'use "copyto" to copy a file to me';
          default:
            return 'use "copyto" followed by a filename to copy a file to me.' +
              ' the "_executable_" symbolic file refers to your good self';
        }
      },
      onResponse: usbStorageConversationHandleResponse
    },
    copyto_unknownfile: {
      text: function () {
        switch (usbStorageConversation.understanding) {
          case 0:
          case 1:
          case 2:
          case 3:
            return 'no_entity';
          case 4:
            return 'file does not exist';
          case 5:
          case 6:
          default:
            return 'no such file, sorry. the "_executable_" file refers to your code';
        }
      },
      onResponse: usbStorageConversationHandleResponse
    },
    help: {
      text: function () {
        switch (usbStorageConversation.understanding) {
          case 0:
          case 1:
          case 2:
          case 3:
            return 'help|copyto';
          case 4:
          case 5:
            return 'commands: help | copyto';
          case 6:
          default:
            return 'i respond to "help" and "copyto". what do you need?';
        }
      },
      onResponse: usbStorageConversationHandleResponse
    },
    acknowledge: {
      text: function () {
        switch (usbStorageConversation.understanding) {
          case 0:
            return '01100000101111000010000101001011001000101010011000000111';
          case 1:
            return '011000A0KNO111D0E010000101001011001000101010011000000111';
          case 2:
            return '011000ACKNOWLEDGE010000101001011001000101010011000000111';
          case 3:
            return '0110000010connection0acknowledged01000101010011000000111';
          case 4:
          case 5:
            return 'connection acknowledged';
          case 6:
          default:
            return 'hi. hearing you loud and clear';
        }
      },
      onResponse: usbStorageConversationHandleResponse
    },
    unrecognised: {
      text: function () {
        switch (usbStorageConversation.understanding) {
          case 0:
            return '11111011101010110101111111101110111001010111001101010110';
          case 1:
            return '1111UN1E1OGNISED010111111C1MM11D111001010111001101010110';
          case 2:
            return '1111UNRECOGNISED010111111COMM1ND111001010111001101010110';
          case 3:
            return '111_UNRECOGNISED_COMMAND_HELP_11011100101011100110101011';
          case 4:
            return '111110111command0not1recognised.0"help"0for1a0list1of0av';
          case 5:
            return 'command not recognised. send "help" for a list of availa';
          case 6:
          default:
            return 'what are you talking about? ask me for "help"!';
        }
      },
      onResponse: usbStorageConversationHandleResponse
    }
  },
  allInputs: {
    prewait: 10,
    postwait: 10
  }
};
window.CONVERSATIONS.usb_storage = usbStorageConversation;
