'use strict';

const couchbase = require('couchbase');
const ReadModel = require('../../').ReadModel('couchbase');
const queue = require('kue').createQueue();
const debug = require('debug')('cqrs:kue-couchbase:readModel');

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

  handleEvent(event, cb) {
    //todo: async flow
    let payload = event.data;
    let order;
    switch (event.type) {
      case 'orderCreated':
        payload.version = 0;
        queue.watchStuckJobs(1000 * 10);
        return queue.process('payment', 20, (job, done) => {
          debug('process event job: %o \t done: %o', job, done);
          this.save(event.aggregateId, event)
            .then(res => {
              done();
              cb(null, res);
            })
            .catch(err => cb(err, null));
        });
        return this.save(payload.orderId, payload)
          .then(res => cb(null, res))
          .catch(err => cb(err, null));
      case 'orderRefounded':
        return this.find(payload.orderId)
          .then(res => {
            order = res.value;
            order.status = payload.status;
            order.version++;
            return this.save(payload.orderId, order);
          })
          .then(res => cb(null, res))
          .catch(err => cb(err, null));
      case 'orderCanceled':
        queue.watchStuckJobs(1000 * 10);
        return queue.process('payment', 20, (job, done) => {
          return this.find(payload.orderId)
            .then(res => {
              order = res.value;
              order.status = payload.status;
              order.version++;
              return this.save(payload.orderId, order);
            })
            .then(res => {
              done();
              cb(null, res)
            })
            .catch(err => cb(err, null));
        });
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