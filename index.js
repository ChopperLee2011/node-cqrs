'use strict';

const EventBus = require('./lib/eventBus');
const Aggregate = require('./lib/aggregate');
const CommandBus = require('./lib/commandBus');
const CommandHandler = require('./lib/commandHandler');
const EventStore = require('./lib/storage/memory/eventStore');
const Repository = require('./lib/repository');


module.exports.EventBus = EventBus;
module.exports.Aggregate = Aggregate;
module.exports.CommandBus = CommandBus;
module.exports.CommandHandler = CommandHandler;
module.exports.EventStore = EventStore;
module.exports.Repository = Repository;