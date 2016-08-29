'use strict';

const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const expect = chai.expect;
chai.use(sinonChai);

const CommandBus = require('../lib/commandBus');
const Mocks = require('./fixture/mocks');

describe('COMMAND-BUS', () => {
  let commandBus;

  beforeEach(() => {
    commandBus = new CommandBus();
  })

  describe('SUCCESS', () => {

    it('#setHandler', () => {
      const noop = () => {};
      commandBus.setHandler('event', noop);
      expect(commandBus.handlers.get('event')).to.equal(noop);
    })

    it('#handleCommand', () => {
      const handler = new Mocks.testCommandHandler();
      commandBus.handlers.set('command', handler);
      const spy = sinon.spy(commandBus.handlers.get('command'), 'handleCommand');

      commandBus.handleCommand('command');
      expect(spy).to.have.been.called;
      spy.restore();
    })


  })

  describe('Fail', () => {

    it('setHandler throw an error when handler is not a function', () => {
      expect(()=> {
        commandBus.setHandler('event', 'handler');
      }).to.throw(Error);
    })

    it('handleCommand throw an error when no handler', () => {
      expect(() => {
        commandBus.handleCommand('command');
      }).to.throw(Error);
    })
  })

})