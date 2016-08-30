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
    return new Promise((resolve, reject) => {
      const Aggregate = this.handlers.get(aggregateType);
      const aggregate = new Aggregate(id);
      let events;
      this.eventStore.load(id)
        .then(res => {
          events = res;
          for (let event in events) {
            aggregate.applyEvent(event);
            aggregate.incrVersion();
          }
          resolve(aggregate);
        })
        .catch(err => {
          return;
        })
    });
  }
}

module.exports = Repository;