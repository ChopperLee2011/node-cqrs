'use strict';

const ReadModel = require('../../').ReadModel('in-memory');
const queue = require('kue').createQueue();
const debug = require('debug')('cqrs:simple:readModel');

class OrderReadModel extends ReadModel {
  constructor() {
    super();
    this.data = new Map();
  }

  handleEvent(event) {
    //todo: async flow
    let payload = event.data;
    let order;
    switch (event.type) {
      case 'orderCreated':
        payload.version = 0;
        return queue.process(event.aggregateId, (job, done) => {
          this.save(event.aggregateId, event);
          done();
        });
      case 'orderRefounded':
        order = this.find(payload.orderId);
        order.status = payload.status;
        order.version++;
        this.save(payload.orderId, order);
        break;
      case 'orderCanceled':
        order = this.find(payload.orderId);
        order.status = payload.status;
        order.version++;
        this.save(payload.orderId, order);
        break;
      default:
        break;
    }
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
    this.data.forEach((value, key) => {
      models.push(value)
    });
    return models;

  }
}

module.exports = OrderReadModel;