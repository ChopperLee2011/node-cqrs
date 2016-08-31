'use strict';

const EventBus = require('./lib/eventBus');
const Aggregate = require('./lib/aggregate');
const CommandBus = require('./lib/commandBus');
const CommandHandler = require('./lib/commandHandler');
const MemoryEventStore = require('./lib/storage/memory/eventStore');
const MemoryReadModel = require('./lib/storage/memory/readModel');
const CouchbaseEventStore = require('./lib/storage/couchbase/eventStore');
const CouchbaseReadModel = require('./lib/storage/memory/readModel');
const Repository = require('./lib/repository');


module.exports.EventBus = EventBus;
module.exports.Aggregate = Aggregate;
module.exports.CommandBus = CommandBus;
module.exports.CommandHandler = CommandHandler;
module.exports.Repository = Repository;

//todo: not a good expect api
module.exports.EventStore = type => {
  switch (type) {
    case 'in-memory':
      return MemoryEventStore;
      break;
    case 'couchbase':
      return CouchbaseEventStore;
      break;
    default:
      return MemoryEventStore;
  }
};

module.exports.ReadModel = type => {
  switch (type) {
    case 'in-memory':
      return MemoryReadModel;
      break;
    case 'couchbase':
      return CouchbaseReadModel;
      break;
    default:
      return MemoryReadModel;
  }
};