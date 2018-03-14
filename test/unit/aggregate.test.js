'use strict';

const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const expect = chai.expect;
chai.use(sinonChai);

const Aggregate = require('../../lib/aggregate');
const Mocks = require('./fixture/mocks');
const uuid = require('uuid');

describe('AGGREGATE', () => {
  let aggregate;

  beforeEach(() => {
    const aggId = uuid.v4();
    aggregate = new Aggregate(aggId);
  })

  describe('SUCCESS', () => {

    it('#incrVersion', () => {
      expect(aggregate.version).to.equal(0);
      aggregate.incrVersion();
      expect(aggregate.version).to.equal(1);
    })

    it('#storeEvent', () => {
      const id = uuid.v4();
      const testEvent = new Mocks.testEvent(id);
      expect(aggregate.uncommittedEvents).to.have.lengthOf(0);
      aggregate.storeEvent(testEvent);
      expect(aggregate.uncommittedEvents).to.have.lengthOf(1);
    })

    it('#clearUncommittedEvents', () => {
      const id = uuid.v4();
      const testEvent = new Mocks.testEvent(id);
      aggregate.storeEvent(testEvent);
      aggregate.storeEvent(testEvent);
      aggregate.storeEvent(testEvent);
      expect(aggregate.uncommittedEvents).to.have.lengthOf(3);
      aggregate.clearUncommittedEvents();
      expect(aggregate.uncommittedEvents).to.have.lengthOf(0);
    })

  })
})
