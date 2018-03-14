'use strict';

const BaseEventBus = require('../../eventBus');
const redis = require('redis');
const debug = require('debug')('cqrs:redis:eventBus');

class EventBus extends BaseEventBus {
  constructor() {
    super();
    this.handler = new Map();
  }

  publishEvent(event) {

  }

  setHandler(eventType, handler) {
    const eventHandlers = this.eventHandlers.get(eventType);
    if (eventHandlers === undefined) {
      this.eventHandlers.set(eventType, [handler]);
    } else {
      eventHandlers.push(handler);
    }
  }

}

module.exports = EventBus;