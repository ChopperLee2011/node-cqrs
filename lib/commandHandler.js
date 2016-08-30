'use strict';

const debug = require('debug')('cqrs:lib:commandhandler');
class CommandHandler {
  constructor(repository) {
    this.aggregates = new Map();
    this.repository = repository;
  }

  // set an aggregate as handler for a command
  setAggregate(aggregateType, commandType) {
    // todo: validate aggregate
    this.aggregates.set(commandType, aggregateType);
  }

  handleCommand(command, cb) {
    debug('CommandHandler is handling this command');
    const aggregateType = this.aggregates.get(command.type);
    if (cb) {
      if (aggregateType === undefined) {
        let err = new Error('Can not find any aggregate registered with this command name.');
        cb(err, null);
      }
      let aggregate;
      this.repository.load(aggregateType, command.aggregateId)
        .then(res => {
          debug('handleCommand repository.load');
          aggregate = res;
          if (aggregate === undefined) {
            throw new Error('Can not find any aggregate in the repoitory');
          }
          aggregate.handleCommand(command, (err, res)=> {
            debug('handleCommand aggregate.handleCommand');
            if (err) {
              cb(err, null);
            }
            this.repository.save(aggregate)
              .then(() => {
                aggregate.clearUncommittedEvents();
                cb(null, res);
              })
              .catch(err => {
                cb(err, null)
              });
          });

        })
    }
  }
}

module.exports = CommandHandler;