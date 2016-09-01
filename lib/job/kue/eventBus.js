'use strict';

const BaseEventBus = require('../../eventBus');
const debug = require('debug')('cqrs:nsq:eventBus');
const kue = require('kue');
const queue = kue.createQueue();


class EventBus extends BaseEventBus {

  constructor() {
    super();
    this.eventHandlers = new Map();
    this.conn = this.connect();
  }

  connect() {
    if (this.conn) {
      return this.conn;
    }
    return Promise.resolve(true);
  }

  publishEvent(event, cb) {
    if (cb) {
      const job = queue.create(event.aggregateId, event)
        .save((err) => {
          if (err) {
            cb(err, null);
          }
          debug('product message success');
          const handlers = this.eventHandlers.get(event.type);
          handlers.forEach(handler => {
            handler.handleEvent(event);
          });
          cb(null);
        });
    }
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