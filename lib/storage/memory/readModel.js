'use strict';

const debug = require('debug')('cqrs:memory:readModel');

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
}

module.exports = ReadModel;