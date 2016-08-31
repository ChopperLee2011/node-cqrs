'use strict';

const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const expect = chai.expect;
chai.use(sinonChai);

const Repository = require('../lib/repository');
const Mocks = require('./fixture/mocks');
const uuid = require('uuid');

describe('REPOSITORY', () => {
  let repository;

  beforeEach(() => {
    const store = new Mocks.testEventStore();
    repository = new Repository(store);
  })

  describe('SUCCESS', () => {
    it('#registerAggregate', () => {
      const id = uuid.v4();
      const agg = new Mocks.testAggregate(id);
      repository.registerAggregate('TestAggregate', agg);
      const handler = repository.handlers.get('TestAggregate');
      expect(handler).to.be.equal(agg);
    })

    it('#save', () => {
      const id = uuid.v4();
      const agg = new Mocks.testAggregate(id);
      const event = new Mocks.testEvent(id, 'event');
      agg.storeEvent(event);
      repository.save(agg);
      let events = repository.eventStore.load(id);
      expect(events).to.have.lengthOf(1);
      repository.save(agg);
      events = repository.eventStore.load(id);
      expect(events).to.have.lengthOf(2);

    })

    it.skip('#load', () => {
      const id = uuid.v4();
      const agg = new Mocks.testAggregate(id);
      repository.registerAggregate('TestAggregate', agg);
      const event = new Mocks.testEvent(id, 'event');
      repository.eventStore.save([event]);
      const spy = sinon.spy(repository.handlers.get('TestAggregate'), 'applyEvent');

      repository.load("TestAggregate", id);
      expect(spy).to.have.been.called;
      spy.restore();
    })
  })

  describe('FAIL', () => {

  })
})