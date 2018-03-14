'use strict';

const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const expect = chai.expect;
chai.use(sinonChai);

const EventBus = require('../../../lib/job/kue/eventBus');
const ReadModel = require('../../../lib/job/kue/readModel');
const Mocks = require('./../fixture/mocks');
const uuid = require('uuid');

describe('EVENT-BUS', () => {
  let eventBus;

  beforeEach(() => {
    eventBus = new EventBus();
  })

  describe('SUCCESS', () => {

    it('#addHandler', () => {
      const id = uuid.v4();
      const event = new Mocks.testEvent(id, 'event');
      const eventHandler = new Mocks.testEventHandler();
      eventBus.setHandler(event.type, eventHandler);
      const handlers = eventBus.eventHandlers.get(event.type);
      expect(handlers).to.have.lengthOf(1);
      eventBus.setHandler(event.type, eventHandler);
      //todo: maybe the result should be 1
      expect(handlers).to.have.lengthOf(2);
    })

    it('#publishEvent', done => {
      const id = uuid.v4();
      const event = new Mocks.testEvent(id, 'event');
      // const eventHandler = new Mocks.testEventHandler();
      const eventHandler = new ReadModel();
      eventBus.setHandler(event.type, eventHandler);
      const spy = sinon.spy(eventBus.eventHandlers.get(event.type)[0], 'handleEvent');
      eventBus.connect()
        .then(() => {
          eventBus.publishEvent(event, (err, res) => {
            expect(err).to.be.not.ok;
            expect(spy).to.have.been.called;
            spy.restore();
            done();
          });
        })
    })

  })
})