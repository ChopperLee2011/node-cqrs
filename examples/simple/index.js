'use strict';
const cqrs = require('../../');
const uuid = require('uuid');
const OrderAggregate = require('../domain/aggregate');
const Commands = require('../domain/commands');
const Events = require('../domain/events');
const OrderReadModel = require('./readModel');

const eventBus = new cqrs.EventBus();
const commandBus = new cqrs.CommandBus();
const MemoryEventStore = cqrs.EventStore('in-memory');
const eventStore = new MemoryEventStore(eventBus);
const repository = new cqrs.Repository(eventStore);
// const orderAggregate = new OrderAggregate();
const aggregateType = 'ORDER_AGGREGATE';
repository.registerAggregate(aggregateType, OrderAggregate);

const handler = new cqrs.CommandHandler(repository);
const MemoryReadModel = cqrs.ReadModel('in-memory');
const eventHandler = new MemoryReadModel();
handler.setAggregate(aggregateType, Commands.CREATE_ORDER);
handler.setAggregate(aggregateType, Commands.REFOUND_ORDER);
handler.setAggregate(aggregateType, Commands.CANCEL_ORDER);

commandBus.setHandler(Commands.CREATE_ORDER, handler);
commandBus.setHandler(Commands.REFOUND_ORDER, handler);
commandBus.setHandler(Commands.CANCEL_ORDER, handler);

eventBus.setHandler(Events.orderCreated, eventHandler);

const orderId = uuid.v4();
const customerId = uuid.v4();
commandBus.handleCommand({
  aggregateId: orderId,
  aggregateType: aggregateType,
  userId: 1,
  type: Commands.CREATE_ORDER,
  data: {
    orderId: orderId,
    customerId: customerId,
    productId: 1,
    amount: 10
  }
}, (err, res)=> {
  if (err) {
    console.log('find error ', err);
  }
  console.log('after CREATE_ORDER eventStore.aggregateRecords', eventStore.aggregateRecords);
  commandBus.handleCommand({
    aggregateId: orderId,
    userId: 1,
    type: Commands.CANCEL_ORDER,
    data: {
      orderId: orderId
    }
  }, (err, res) => {
    if (err) {
      console.log('find error ', err);
    }
    console.log('after CANCEL_ORDER eventStore.aggregateRecords', eventStore.aggregateRecords);
  })
});

