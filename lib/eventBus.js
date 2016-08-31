'use strict';

const debug = require('debug')('cqrs:lib:eventBus');
class EventBus {
  constructor() {
    this.eventHandlers = new Map();
  }

  // todo: change to use event emitter or disqueue
  publishEvent(event) {
    debug('eventBus is handling this event');
    const handlers = this.eventHandlers.get(event.type);
    if (handlers === undefined || handlers.length === 0) {
      throw new Error('Can not find any handler registered with this event.');
    }
    handlers.forEach(handler => {
      handler.handleEvent(event);
    })
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