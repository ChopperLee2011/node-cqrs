'use strict';

class ReadModel {
  constructor() {
    this.data = new Map();
  }

  save(id, model) {
    this.data.set(id, model);
  }

  findAll() {
    let models = [];
    data.forEach((value,key) => {
      models.push(value)
    });
  }
}

module.exports = ReadModel;