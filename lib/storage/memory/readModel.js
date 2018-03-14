'use strict';

const debug = require('debug')('cqrs:memory:readModel');
const nsq = require('nsqjs');

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
    const reader = new nsq.Reader(event.type, 'test_channel', {
      lookupdHTTPAddresses: '127.0.0.1:4161'
    });
    switch (event.type) {
      case 'TestEvent':
        reader.connect();
        reader.on('message', () => {
          const m = this.find(event.aggregateId);
          m.updated = true;
          this.save(event.aggregateId, m);
        });
        break;
      default:
        break;
    }
  }

  // subscribe(eventType, handler) {
  //   const reader = new nsq.Reader(eventType, 'test_channel', {
  //     lookupdHTTPAddresses: '127.0.0.1:4161'
  //   });
  //   reader.connect();
  //   reader.on('message', handler);
  //   const c = new Consumer('events', 'ingestion', {
  //     lookupdHTTPAddresses: ['127.0.0.1:4160', '127.0.0.1:4161']
  //   });
  //   c.consume((msg) => {
  //     console.log(msg.body.toString());
  //     const result = handle(msg);
  //     if (result) {
  //       msg.finish();
  //     } else {
  //       msg.requeue(3000); //requeue with delay of 3000 milliseconds
  //     }
  //   });
  // }
}

module.exports = ReadModel;