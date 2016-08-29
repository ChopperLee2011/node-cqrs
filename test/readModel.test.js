'use strict';

const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const expect = chai.expect;
chai.use(sinonChai);

const ReadModel = require('../lib/storage/memory/readModel');
const Mocks = require('./fixture/mocks');

describe('COMMAND-HANDLER', () => {
  let readModel;

  beforeEach(() => {
    readModel = new ReadModel();
  })

  describe('SUCCESS', () => {

    it('#', () => {

    })
  })
})