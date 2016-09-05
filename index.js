'use strict';

const Aggregate = require('./lib/aggregate');
const CommandBus = require('./lib/commandBus');
const CommandHandler = require('./lib/commandHandler');
const MemoryEventStore = require('./lib/storage/memory/eventStore');
const MemoryReadModel = require('./lib/storage/memory/readModel');
const CouchbaseEventStore = require('./lib/storage/couchbase/eventStore');
const MemoryEventBus = require('./lib/eventBus');
const KueEventBus = require('./lib/job/kue/eventBus');
const CouchbaseReadModel = require('./lib/storage/memory/readModel');
const Repository = require('./lib/repository');


module.exports.Aggregate = Aggregate;
module.exports.CommandBus = CommandBus;
module.exports.CommandHandler = CommandHandler;
module.exports.Repository = Repository;

//todo: not a good expect api
module.exports.EventStore = type => {
  switch (type) {
    case 'in-memory':
      return MemoryEventStore;
    case 'couchbase':
      return CouchbaseEventStore;
    default:
      return MemoryEventStore;
  }
};

module.exports.ReadModel = type => {
  switch (type) {
    case 'in-memory':
      return MemoryReadModel;
    case 'couchbase':
      return CouchbaseReadModel;
    default:
      return MemoryReadModel;
  }
};

module.exports.EventBus = type => {
  switch (type) {
    case 'kue':
      return KueEventBus;
    default:
      return MemoryEventBus;
  }
};
