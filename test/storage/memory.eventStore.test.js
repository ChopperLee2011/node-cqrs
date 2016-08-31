'use strict';

const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const expect = chai.expect;
chai.use(sinonChai);

const EventStore = require('../../lib/storage/memory/eventStore');
const Mocks = require('../fixture/mocks');
const uuid = require('uuid');

describe('EVENT-STORE', () => {
  let eventStore;

  beforeEach(() => {
    eventStore = new EventStore();
  })

  describe('SUCCESS ', () => {

    it('#save', () => {
      const id = uuid.v4();
      const eventBus = new Mocks.testEventBus();
      const testEvent = new Mocks.testEvent(id, 'event');
      eventStore.eventBus = eventBus;
      eventStore.save([testEvent]);
      expect(eventStore.aggregateRecords[0].version).to.equal(0);
      eventStore.save([testEvent]);
      expect(eventStore.aggregateRecords[0].version).to.equal(0);
    })

    it('#load', done => {
      const id = uuid.v4();
      const eventBus = new Mocks.testEventBus();
      const testEvent = new Mocks.testEvent(id, 'event');
      eventStore.eventBus = eventBus;
      eventStore.save([testEvent]);
      eventStore.load(id)
        .then(events => {
          expect(events).to.have.lengthOf(1);
          done();
        });
    })

  })
})