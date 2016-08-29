'use strict';
class EventStore {
  constructor(eventBus) {
    this.eventBus = eventBus;
    this.aggregateRecords = new Map(); // in-memory;
  }

  save(events) {
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
        });
      } else {
        aggregate.version++;
        record.version = aggregate.version;
        aggregate.events.push(record);
        this.aggregateRecords.set(event.aggregateId, aggregate);
      }
    })
  }

  load(aggregateId) {
    // const events = [];
    // const aggregate = this.aggregateRecords(aggregateId);
    // aggregate.events.forEach((event, i) => {
    //   events[i] = event;
    // })
    const aggregate = this.aggregateRecords(aggregateId);
    return aggregate.events;
  }
}

moduel.exports = EventStore;