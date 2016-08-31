'use strict';

const uuid = require('uuid');

const debug = require('debug')('cqrs:lib:baseaggregate');
class Aggregate {
  constructor(id) {
    this.id = id || uuid.v4();
    this.version = 0;
    this.uncommittedEvents = [];
  }

  // increment aggregate version by 1.
  incrVersion() {
    this.version++;
  }

  handleCommand(command, cb) {
  }

  applyEvent(event) {
  }

  storeEvent(event) {
    debug('storeEvent event: %o', event);
    return new Promise((resolve, reject) => {
      this.uncommittedEvents.push(event);
      resolve();
    })
  }

  clearUncommittedEvents() {
    debug('clearUncommittedEvents');
    this.uncommittedEvents.length = 0;
  }
}

module.exports = Aggregate;