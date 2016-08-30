'use strict';

const debug = require('debug')('cqrs:lib:commandbus');
class CommandBus {
  constructor() {
    // key: command type
    // value: command handler
    this.handlers = new Map();
  }

  // set a handler to a command.
  setHandler(commandType, handler) {
    // if (typeof handler != 'function') {
    //   throw new Error('Handler should be a function.');
    // }
    this.handlers.set(commandType, handler);
  }

  // handle a command
  handleCommand(command, cb) {
    debug('CommandBus is handling this command');
    //todo: validate command
    const handler = this.handlers.get(command.type);
    if (handler === undefined) {
      throw new Error('Can not find any handler registered with this command type.');
    }
    if (cb) {
      handler.handleCommand(command, (err, res) => {
        if (err) {
          cb(err, null);
        }
        cb(null, res);
      });
    }
  }
}

module.exports = CommandBus;