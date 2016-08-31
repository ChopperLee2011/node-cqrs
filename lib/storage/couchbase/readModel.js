'use strict';

class ReadModel {
  constructor() {
    this.data = new Map();
  }

  save(id, model) {
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