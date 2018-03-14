'use strict';
const cqrs = require('../../');
const uuid = require('uuid');
const OrderAggregate = require('../domain/aggregate');
const Commands = require('../domain/commands');
const Events = require('../domain/events');

const KueEventBus = cqrs.EventBus('kue');
const eventBus = new KueEventBus();
const commandBus = new cqrs.CommandBus();
const MemoryEventStore = cqrs.EventStore('in-memory');
const eventStore = new MemoryEventStore(eventBus);
const repository = new cqrs.Repository(eventStore);
const aggregateType = 'ORDER_AGGREGATE';
repository.registerAggregate(aggregateType, OrderAggregate);

const handler = new cqrs.CommandHandler(repository);
const ReadModel = require('./readModel');
const OrderReadModel = new ReadModel();
const eventHandler = OrderReadModel;
handler.setAggregate(aggregateType, Commands.CREATE_ORDER);
handler.setAggregate(aggregateType, Commands.REFOUND_ORDER);
handler.setAggregate(aggregateType, Commands.CANCEL_ORDER);

commandBus.setHandler(Commands.CREATE_ORDER, handler);
commandBus.setHandler(Commands.REFOUND_ORDER, handler);
commandBus.setHandler(Commands.CANCEL_ORDER, handler);

eventBus.setHandler(Events.orderCreated, eventHandler);
eventBus.setHandler(Events.orderRefounded, eventHandler);
eventBus.setHandler(Events.orderCanceled, eventHandler);

const orderId = uuid.v4();
const customerId = uuid.v4();

// COMMAND: emit 'create order' command
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
  // COMMAND: emit 'cancel order' command
  commandBus.handleCommand({
    aggregateId: orderId,
    aggregateType: aggregateType,
    userId: 1,
    type: Commands.CANCEL_ORDER,
    data: {
      orderId: orderId
    }
  }, (err, res) => {
    if (err) {
      console.log('find error ', err);
    }

    //QUERY: emit 'find all order' query
    const orders = OrderReadModel.findAll();
    console.log('findAll orders', orders);
  })
});

