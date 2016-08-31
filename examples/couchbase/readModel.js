'use strict';

const couchbase = require('couchbase');
const ReadModel = require('../../').ReadModel('couchbase');
const debug = require('debug')('cqrs:simple:readModel');

class OrderReadModel extends ReadModel {

  //todo: change the configure from eventStore
  constructor(opt) {
    super();
    opt = opt || {};
    opt.host = opt.host || 'localhost';
    opt.database = opt.database || 'event';
    const cluster = new couchbase.Cluster(`couchbase://${opt.host}`);
    debug('database connecting...');
    this.db = cluster.openBucket(opt.database);
  }

  handleEvent(event) {
    //todo: async flow
    let payload = event.data;
    let order;
    switch (event.type) {
      case 'orderCreated':
        payload.version = 0;
        this.save(payload.orderId, payload);
        break;
      case 'orderRefounded':
        this.find(payload.orderId)
          .then(res => {
            order = res.value;
            order.status = payload.status;
            order.version++;
            this.save(payload.orderId, order);
          });
        break;
      case 'orderCanceled':
        this.find(payload.orderId)
          .then(res => {
            order = res.value;
            order.status = payload.status;
            order.version++;
            this.save(payload.orderId, order);
          });
        break;
      default:
        break;
    }
  }

  save(id, model) {
    debug('save id:%s \t model:%o', id, model);
    return new Promise((resolve, reject) => {
      this.db.upsert(id, model, (err, r) => {
        if (err) {
          return reject(err);
        }
        resolve(r);
      });
    })
  }

  // find value by id
  find(id) {
    return new Promise((resolve, reject)=> {
      this.db.get(id, (err, r)=> {
        if (err) {
          return reject(err);
        }
        resolve(r);
      });
    })
  }

  // find all value
  findAll() {
    // let models = [];
    // this.data.getforEach(value => {
    //   models.push(value)
    // });
    // return models;

  }
}

module.exports = OrderReadModel;