'use strict';

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
    //todo: validate events
    events.forEach(event => {
      const record = {
        eventType: event.type,
        timestamp: Date.now(),
        event: event
      }
      const aggregate = this.aggregateRecords.get(event.aggregateId);
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

      //todo: async this workflow
      this.eventBus.publishEvent(event);
    })
  }

  // load all events for the aggregate id
  load(id) {
    return new Promise((resolve, reject) => {
      const aggregate = this.aggregateRecords.get(id);
      if (aggregate === undefined) {
        return reject(new Error('Can not find any aggreagte registered with this aggregate id.'));
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