'use strict';

const debug = require('debug')('cqrs:memory:readModel');
const kue = require('kue');
const queue = kue.createQueue();

//todo: extend from repository
class ReadModel {
  constructor() {
    this.data = new Map();
  }

  save(id, model) {
    debug('save id:%s \t model:%o', id, model);
    this.data.set(id, model);
  }

  // find value by id
  find(id) {
    return this.data.get(id);
  }

  // find all value
  findAll() {
    let models = [];
    this.data.forEach(value => {
      models.push(value)
    });
    return models;

  }

  handleEvent(event) {
    switch (event.type) {
      case 'TestEvent':
        queue.process(event.aggregateId, (job, done) => {
          this.save(event.aggregateId, event);
          done();
        });
        break;
      default:
        break;
    }
  }

}

module.exports = ReadModel;