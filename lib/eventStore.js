'use strict';


class EventStore {
  constructor(eventBus, opt) {
    this.interfaceName = 'EventStore';
    this.eventBus = eventBus;
    this.aggregateRecords;
  }

  save(events) {
    //todo: do arguments check
    //todo: do event structs check
    throw new Error(`${this.interfaceName} requires an implementation for 'save' method`);
  }

  load(aggregateId) {
    throw new Error(`${this.interfaceName} requires an implementation for 'load' method`);
  }
}

module.exports = EventStore;