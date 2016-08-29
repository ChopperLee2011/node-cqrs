'use strict';

class CommandBus {
  constructor() {
    // key: command type
    // value: command handler
    this.handlers = new Map();
  }

  // set a handler to a command.
  setHandler(commandType, handler) {
    if (typeof handler != 'function') {
      throw new Error('Handler should be a function.');
    }
    this.handlers.set(commandType, handler);
  }

  // handle a command
  handleCommand(commandType) {
    const handler = this.handlers.get(commandType);
    if (handler === undefined) {
      throw new Error('Can not find any handler registered with this command type.');
    }
    handler.handleCommand(commandType);
  }
}

module.exports = CommandBus;