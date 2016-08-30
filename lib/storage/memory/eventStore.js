'use strict';

const debug = require('debug')('cqrs:memory:eventstore');
class Event {
  constructor() {
  }
}

class EventStore {
  constructor(eventBus) {
    this.eventBus = eventBus;
    this.aggregateRecords = new Map();
  }

  save(events) {
    debug('save events: %o', events);
    //todo: validate events

    return new Promise((resolve, reject) => {
      events.forEach(event => {
        debug('save event: %o', event);
        const record = {
          eventType: event.type,
          timestamp: Date.now(),
          event: event
        };
        const aggregate = this.aggregateRecords.get(event.aggregateId);
        debug('save aggregate: %o', aggregate);
        if (aggregate === undefined) {
          this.aggregateRecords.set(event.aggregateId, {
            aggregateId: event.aggregateId,
            version: 0,
            events: [record]
          })
        } else {
          aggregate.version++;
          record.version = aggregate.version;
          aggregate.events.push(record);
        }
        debug('save this.aggregateRecords: %o ', this.aggregateRecords);
        //todo: pub-sub or promise ?
        this.eventBus.publishEvent(event);
        resolve();
      })
    });
  }

  // load all events for the aggregate id
  load(id) {
    debug('load id: %s', id);
    return new Promise((resolve, reject) => {
      const aggregate = this.aggregateRecords.get(id);
      if (aggregate === undefined) {
        return reject(new Error('Can not find any aggregate registered with this id.'));
      }
      let events = [];
      aggregate.events.forEach((event, i) => {
        events[i] = event;
      });
      resolve(events);
    });
  }
}

module.exports = EventStore;