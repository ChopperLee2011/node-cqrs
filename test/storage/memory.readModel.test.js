'use strict';

const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const expect = chai.expect;
chai.use(sinonChai);

const ReadModel = require('../../lib/storage/memory/readModel');
const Mocks = require('../fixture/mocks');
const uuid = require('uuid');

describe('READ-MODEL', () => {
  let readModel;

  beforeEach(() => {
    readModel = new ReadModel();
  })

  describe('SUCCESS ', () => {

    it('#save', () => {
      const id = uuid.v4();
      const model = new Mocks.testModel(id);
      readModel.save(id, model);
      expect(readModel.data.get(id)).to.equal(model);
    })

    it('#findAll', () => {
      let result = readModel.findAll();
      expect(result).to.be.empty;
      const id = uuid.v4();
      const model = new Mocks.testModel(id);
      readModel.save(id, model);
      result = readModel.findAll();
      expect(result).to.have.lengthOf(1);
    })

    it('#find', () => {
      const id = uuid.v4();
      const model = new Mocks.testModel(id);
      readModel.save(id, model);
      const result = readModel.find(id);
      expect(result).to.equal(model);
    })

  })
})