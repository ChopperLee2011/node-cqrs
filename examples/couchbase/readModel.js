'use strict';

const ReadModel = require('../../').ReadModel('couchbase');
const debug = require('debug')('cqrs:couchbase:readModel');

class OrderReadModel extends ReadModel {
  constructor() {
    super();
  }
}

module.exports = OrderReadModel;