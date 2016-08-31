'use strict';

const ReadModel = require('../../').ReadModel('in-memory');
const debug = require('debug')('cqrs:simple:readModel');

class OrderReadModel extends ReadModel {

  handleEvent(event) {
    switch (event.type) {
      case 'orderCreated':
        this.save();
        break;
      case 'orderRefounded':
        this.save();
        break;
      case 'orderCanceled':
        this.save();
        break;
      default:
        break;
    }
  }

}

module.exports = OrderReadModel;