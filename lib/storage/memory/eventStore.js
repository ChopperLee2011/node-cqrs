'use strict';

const baseStore = require('../../eventStore');
const debug = require('debug')('cqrs:memory:eventstore');

class EventStore extends baseStore {
  constructor(eventBus, opt) {
    super();
    this.eventBus = eventBus;
    this.aggregateRecords = [];
  }

  save(events) {
    debug('save events: %o', events);
    //todo: validate events

    return new Promise((resolve, reject) => {
      // stop doing aggregate table

      // events.forEach(event => {
      //   debug('save event: %o', event);
      //   const record = {
      //     eventType: event.type,
      //     timestamp: Date.now(),
      //     event: event
      //   };
      //   const aggregate = this.aggregateRecords.get(event.aggregateId);
      //   debug('save aggregate: %o', aggregate);
      //   if (aggregate === undefined) {
      //     this.aggregateRecords.set(event.aggregateId, {
      //       aggregateId: event.aggregateId,
      //       version: 0,
      //       events: [record]
      //     })
      //   } else {
      //     aggregate.version++;
      //     record.version = aggregate.version;
      //     aggregate.events.push(record);
      //   }
      //   debug('save this.aggregateRecords: %o ', this.aggregateRecords);
      //   this.eventBus.publishEvent(event);
      //   resolve();
      // })

      //todo: race-condition, how to do when update event before create event for the same aggregate?
      events.forEach(event => {
        debug('save event: %o', event);
        const record = Object.assign({
          timestamp: Date.now(),
        }, event);
        // todo: change to database auto-increasing way?
        const aggregate = this.aggregateRecords.filter(e => e.aggregateId === record.aggregateId);
        debug('save aggregate: %o', aggregate);
        if (aggregate.length === 0) {
          record.version = 0;
          this.aggregateRecords.push(record);
        } else {
          let curVersion = (Math.max(aggregate.map(e => e.data.version)));
          record.version = ++curVersion;
          this.aggregateRecords.push(record);
        }
        debug('save this.aggregateRecords: %o ', this.aggregateRecords);

        // async puhlish flow
        this.eventBus.publishEvent(event);
        resolve();
      })
    });
  }

  // load all events for the aggregate id
  load(id) {
    debug('load id: %s', id);
    return new Promise((resolve, reject) => {
      const aggregates = this.aggregateRecords.filter(r => r.aggregateId === id);
      if (aggregates === undefined || aggregates.length === 0) {
        return reject(new Error('Can not find any aggregate registered with this id.'));
      }
      resolve(aggregates);
    });
  }
}

module.exports = EventStore;