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
    for (let event in events) {
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
    }
  }

  // load all events for the aggregate id
  load(id) {
    const aggregate = this.aggregateRecords.get(id);
    if (aggregate === undefined) {
      throw new Error('Can not find any aggreagte registered with this aggregate id.');
    }
    let events = new Map();
    aggregate.forEach((record, key) => {
      events.set(key, record.event);
    });
    return events;
  }
}

module.exports = EventStore;