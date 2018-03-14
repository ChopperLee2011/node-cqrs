'use strict';

const BaseEventBus = require('../../eventBus');
const debug = require('debug')('cqrs:nsq:eventBus');
const nsq = require('nsqjs');

const defaultTopic = 'cqrs';
const nsqWriter = new nsq.Writer('127.0.0.1', 4150);

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
    return new Promise((resolve, reject) => {
      nsqWriter.connect();
      nsqWriter.on('ready', () => resolve());
      nsqWriter.on('error', err => reject(err));
    });
  }

  publishEvent(event, cb) {
    if (cb) {
      //todo: move creating writer instance out of this function.
      nsqWriter.publish(event.type || defaultTopic, 'message', err => {
        if (err) {
          cb(err, null);
        }
        debug('product message success');
        const handlers = this.eventHandlers.get(event.type);
        handlers.forEach(handler => {
          handler.handleEvent(event);
        })
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