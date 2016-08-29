'use strict';

class Repository {
  constructor(eventStore) {
    this.eventStore = eventStore;
    this.handlers = new Map();
  }

  // registe a aggregate
  registerAggregate(aggregateType, aggregate) {
    const handler = this.handlers.get(aggregateType);
    if (handler) {
      throw new Error('This aggregate type is already registered.');
    }
    this.handlers.set(aggregateType, aggregate);
  }

  save(aggregate) {
    const events = aggregate.uncommittedEvents;
    if (events.length > 0) {
      this.eventStore.save(events);
    }
    aggregate.clearUncommittedEvents();
  }

  // load events by aggregate id;
  load(aggregateType, id) {
    const aggregate = this.handlers.get(aggregateType);
    const events = this.eventStore.load(id);
    for (let event in events) {
      aggregate.applyEvent(event);
      aggregate.incrVersion();
    }
    return aggregate;
  }
}

module.exports = Repository;