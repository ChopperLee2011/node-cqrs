'use strict';

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
      throw new Error('Can not find any aggreaget registered with this command name.');
    }
    const aggregate = this.repository.load(aggregateType, command.aggregateId);

    aggregate.handleCommand(command.type);

    this.repository.save(aggregate);
  }

}

module.exports = CommandHandler;