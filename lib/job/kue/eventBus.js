'use strict';

const BaseEventBus = require('../../eventBus');
const debug = require('debug')('cqrs:kue:eventBus');
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
      event.data.title = event.aggregateId;
      const priority = event.priority || 'normal';
      const job = queue.create('payment', event.data)
        .priority(priority)
        .attempts(5)
        .backoff(true)
        .removeOnComplete(false)
        .save(err => {
          if (err) {
            cb(err, null);
          }
          debug('product message success');
          const handlers = this.eventHandlers.get(event.type);
          //todo: change to use promise.all
          // handlers.forEach(handler => {
          //   handler.handleEvent(event, (err, res)=> {
          //     if (err) {
          //       cb(err, null);
          //     }
          //     cb(null, res);
          //   });
          // });

          handlers[0].handleEvent(event, (err, res)=> {
            if (err) {
              cb(err, null);
            }
            cb(null, res);
          });
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