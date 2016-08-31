'use strict';

const Aggregate = require('../../').Aggregate;
const Commands = require('./commands');
const Events = require('./events');
const uuid = require('uuid');
const debug = require('debug')('cqrs:domain:aggregate');

const OrderAggregateType = 'ORDER';
const CREATE_ORDER_STATUS = 0;
const REFOUND_ORDER_STATUS = 4;
const CANCEL_ORDER_STATUS = 5;

class OrderAggregate extends Aggregate {
  constructor() {
    super();
    this.orderId;
    this.customerId;
    this.productId;
    this.amount;
  }

  handleCommand(command, cb) {
    debug('aggregate is handling it');
    switch (command.type) {
      case Commands.CREATE_ORDER:
        if (cb) {
          this.storeEvent({
            id: uuid.v4(),
            aggregateId: command.aggregateId,
            aggregateType: OrderAggregateType,
            type: Events.orderCreated,
            userId: command.userId,
            timestamp: Date.now(),
            data: {
              orderId: command.data.orderId,
              status: CREATE_ORDER_STATUS,
              customerId: command.data.customerId,
              productId: command.data.productId,
              amount: command.data.amount
            }
          })
            .then(res => cb(null, res))
            .catch(err => cb(err, null))
        }
        break;
      case Commands.REFOUND_ORDER:
        if (cb) {
          this.storeEvent({
            id: uuid.v4(),
            aggregateId: command.aggregateId,
            aggregateType: OrderAggregateType,
            type: Events.orderRefounded,
            userId: command.userId,
            timestamp: Date.now(),
            data: {
              orderId: command.data.orderId,
              status: REFOUND_ORDER_STATUS
            }
          })
            .then(res => cb(null, res))
            .catch(err => cb(err, null))
        }
        break;
      case Commands.CANCEL_ORDER:
        if (cb) {
          this.storeEvent({
            id: uuid.v4(),
            aggregateId: command.aggregateId,
            aggregateType: OrderAggregateType,
            type: Events.orderCanceled,
            userId: command.userId,
            timestamp: Date.now(),
            data: {
              orderId: command.data.orderId,
              status: CANCEL_ORDER_STATUS
            }
          })
            .then(res => cb(null, res))
            .catch(err => cb(err, null))
        }
        break;
      default:
        break;
    }
  }

  // handleEvent(event) {
  //   switch (event.type) {
  //     case 'orderCreated':
  //       this.name = event.Name;
  //       this.age = event.age;
  //       break;
  //     case 'orderRefounded':
  //       break;
  //     case 'orderCanceled':
  //       break;
  //     default:
  //       break;
  //   }
  // }
}

module.exports = OrderAggregate;
