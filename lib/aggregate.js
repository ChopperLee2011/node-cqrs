'use strict';

const uuid = require('uuid');

const debug = require('debug')('cqrs:lib:aggregate');
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

  handleCommand(command) {
  }

  applyEvent(event) {
  }

  storeEvent(event) {
    this.uncommittedEvents.push(event);
  }

  clearUncommittedEvents() {
    this.uncommittedEvents.length = 0;
  }
}

module.exports = Aggregate;