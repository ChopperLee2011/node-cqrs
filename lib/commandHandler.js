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

  handleCommand(command) {
    const aggregateType = this.aggregates.get(command.type);
    if (aggregateType === undefined) {
      throw new Error('Can not find any aggregate registered with this command name.');
    }
    // todo: with promise
    let aggregate;
    return this.repository.load(aggregateType, command.aggregateId)
      .then(res => {
        aggregate = res;
        if (aggregate === undefined) {
          throw new Error('Can not find any aggregate in the repoitory');
        }
        aggregate.handleCommand(command);

        this.repository.save(aggregate);
      })
  }

}

module.exports = CommandHandler;