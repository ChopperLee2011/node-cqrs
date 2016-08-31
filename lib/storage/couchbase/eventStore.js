'use strict';

const couchbase = require('couchbase');
const baseStore = require('../../eventStore');
const debug = require('debug')('cqrs:couchbase:eventstore');

class EventStore extends baseStore {

  constructor(eventBus, opt) {
    super();
    opt = opt || {};
    opt.host = opt.host || 'localhost';
    opt.database = opt.database || 'event';
    this.eventBus = eventBus;
    this.aggregateRecords = new Map();
    const cluster = new couchbase.Cluster(`couchbase://${opt.host}`);
    debug('database connecting...');
    this.db = cluster.openBucket(opt.database);
  }

  save(events) {
    // stop doing aggregate table

    // debug('save events: %o', events);
    // return new Promise((resolve, reject) => {
    //   events.forEach(event => {
    //     debug('save event: %o', event);
    //     const record = {
    //       eventType: event.type,
    //       timestamp: Date.now(),
    //       event: event
    //     };
    //     this.db.get(event.aggregateId, (err, res) => {
    //       if (err && err.code === 13) {
    //         debug('inserting...');
    //         this.db.insert(event.aggregateId, {
    //           aggregateId: event.aggregateId,
    //           version: 0,
    //           events: [record]
    //         }, (err, res)=> {
    //           // this.eventBus.publishEvent(event);
    //           resolve();
    //         })
    //       } else {
    //         const aggregate = res.value;
    //         debug('updating...');
    //         aggregate.version++;
    //         record.version = aggregate.version;
    //         aggregate.events.push(record);
    //         this.db.upsert(event.aggregateId, aggregate, (err, res)=> {
    //           resolve();
    //         })
    //       }
    //     })
    //   });
    // });

    debug('save events: %o', events);
    return Promise.all(events.map(event => {
      debug('save event: %o', event);
      const record = Object.assign({
        timestamp: Date.now(),
      }, event);
      return new Promise((resolve, reject) => {
        this.db.insert(record.id, record, (err, res) => {
          if (err) {
            return reject();
          }
          debug('already save this record: %o', record);
          this.eventBus.publishEvent(event);
          resolve();
        });
      });
    }));
  }

  // load all events for the aggregate id
  load(id) {
    debug('load id: %s', id);
    return new Promise((resolve, reject) => {
      const aggregate = this.aggregateRecords.get(id);
      if (aggregate === undefined) {
        return reject(new Error('Can not find any aggregate registered with this id.'));
      }
      let events = [];
      aggregate.events.forEach((event, i) => {
        events[i] = event;
      });
      resolve(events);
    });
  }

  //close database connection
  closeDB() {
    this.db.close();
  }
}

module.exports = EventStore;