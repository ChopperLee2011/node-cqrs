'use strict';

const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const expect = chai.expect;
chai.use(sinonChai);

const EventStore = require('../lib/storage/memory/eventStore');
const Mocks = require('./fixture/mocks');

describe('COMMAND-HANDLER', () => {
  let eventStore;

  beforeEach(() => {
    eventStore = new EventStore();
  })

  describe('SUCCESS ', () => {

    it('#save', () => {

    })

    it('#load', () => {

    })

  })
})