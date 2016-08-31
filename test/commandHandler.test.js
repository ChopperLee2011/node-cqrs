'use strict';

const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const expect = chai.expect;
chai.use(sinonChai);

const CommandHandler = require('../lib/commandHandler');
const Mocks = require('./fixture/mocks');
const uuid = require('uuid');
const noop = () => {};

describe('COMMAND-HANDLER', () => {
  let commandHandler;
  const aggId = uuid.v4();

  beforeEach(() => {
    const aggregate = new Mocks.testAggregate(aggId);
    const repository = new Mocks.testRepository();
    repository.aggregates.set(aggId, aggregate);
    commandHandler = new CommandHandler(repository);
  })

  describe('SUCCESS', () => {

    it('#setAggregate', () => {
      const id = uuid.v4();
      const testCommand = new Mocks.testCommand(id, 'command');
      const testAggregate = new Mocks.testAggregate(id);
      commandHandler.setAggregate(testAggregate.type, testCommand.type);
      expect(commandHandler.aggregates.get(testCommand.type)).to.equal(testAggregate.type);
    })

    it('#handleCommand', () => {
      const testCommand = new Mocks.testCommand(aggId, 'command');
      const testAggregate = new Mocks.testAggregate(aggId);
      commandHandler.setAggregate(testAggregate.type, testCommand.type);
      const spy = sinon.spy(commandHandler.repository.load(testAggregate.type, testCommand.aggregateId), 'handleCommand');
      commandHandler.handleCommand(testCommand, noop);
      expect(spy).to.have.been.called;
      spy.restore();
    })
  })

  describe('Fail', () => {

  })
})