'use strict';

const Aggregate = require('../../').Aggregate;

const debug = require('debug')('cqrs:domain:aggregate');
//todo: change to use contant file
const InvitationAggregateType = "Invitation";
const CREATE_ORDER_STATUS = 0;
const CANCEL_ORDER_STATUS = 5;
class InvitationAggregate extends Aggregate {
  constructor() {
    super();
    this.name;
    this.age;
    this.accepted;
    this.decline;
  }

  handleCommand(command, cb) {
    debug('aggregate is handling it');
    switch (command.type) {
      case 'CREATE_ORDER':
        if (cb) {
          this.storeEvent({
            aggregateId: command.aggregateId,
            name: command.name,
            orderId: command.aggregateId,
            status: CREATE_ORDER_STATUS,
            productId: command.productId
          }).then(()=> {
            cb(null, null);
          })
        }
        break;
      case 'CANCEL_ORDER':
        if (cb) {
          this.storeEvent({
            aggregateId: command.aggregateId,
            orderId: command.orderId,
            status: CANCEL_ORDER_STATUS
          }).then(()=> {
            cb(null, null);
          })
        }
        break;
      default:
        break;
    }
  }

  applyEvent(event) {
    switch (event.type) {
      case 'orderCreated':
        this.name = event.Name;
        this.age = event.age;
        break;
      default:
        break;
    }
  }
}

module.exports = InvitationAggregate;
