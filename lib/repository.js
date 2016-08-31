'use strict';

const debug = require('debug')('cqrs:lib:repository');
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
    debug('save aggregate: %o', aggregate);
    const events = aggregate.uncommittedEvents;
    debug('save events: %o', events);
    if (events.length > 0) {
      return this.eventStore.save(events);
    }
  }

  // load events by aggregate id;
  load(aggregateType, id) {
    debug('load aggregateType: %s \t id: %s', aggregateType, id);
    const Aggregate = this.handlers.get(aggregateType);
    const aggregate = new Aggregate(id);
    return aggregate;
  }
}

module.exports = Repository;