'use strict';
const uuid = require('uuid');

class testCommandHandler {
  constructor() {
    this.command = {};
  }

  handleCommand(command) {
    this.command = command;
  }
}

class testRepository {
  constructor() {
    this.aggregates = new Map();
  }

  load(aggreagetType, id) {
    return this.aggregates.get(id);
  }

  save(aggregate) {
    return this.aggregates.set(aggregate.id, aggregate);
  }
}

class testAggregate {
  constructor(id) {
    this.id = id;
    this.type = "TestAggregate";
    this.uncommittedEvents = [];
  }

  handleCommand(commandType) {
    switch (commandType) {
      case "TestAggregate":
        this.storeEvent();
        break;
      default:
        break;
    }
  }

  storeEvent(event) {
    this.uncommittedEvents.push(event);
  }

  clearUncommittedEvents() {
  }

  applyEvent() {

  }

  incrVersion() {

  }
}

class testEvent {
  constructor(id, content) {
    this.aggregateId = id;
    this.content = content;
    this.aggregateType = "Test";
    this.type = "TestEvent"
  }
}

class testCommand {
  constructor(id, content) {
    this.aggregateId = id;
    this.content = content;
    this.aggregateType = "Test";
    this.type = "TestCommand"
  }
}

class testEventStore {
  constructor() {
    this.events = [];

  }

  save(events) {
    this.events = this.events.concat(events);
  }

  load(id) {
    return this.events;
  }
}

class testEventHandler {
  constructor() {
    this.events = [];
  }

  handleEvent(event) {
    this.events.push(event);
  }
}

class testEventBus {
  constructor() {
    this.events = [];
  }

  publishEvent() {

  }

  addHandler() {

  }

}

class testModel {
  constructor(id) {
    this.id;
    this.content;
  }
}

module.exports = {
  testCommandHandler,
  testRepository,
  testAggregate,
  testEvent,
  testCommand,
  testEventStore,
  testEventHandler,
  testEventBus,
  testModel,
};
