'use strict';
const cqrs = require('../../');
const uuid = require('uuid');
const InvitationAggregate = require('../domain/aggregate');
// const command = require('../domain/commands');

const eventBus = new cqrs.EventBus();
const commandBus = new cqrs.CommandBus();
const eventStore = new cqrs.EventStore(eventBus);
const repository = new cqrs.Repository(eventStore);
// const invatationAggregate = new InvitationAggregate();

repository.registerAggregate('ORDER_AGGREGATE', InvitationAggregate);

const handler = new cqrs.CommandHandler(repository);
handler.setAggregate('ORDER_AGGREGATE', 'CREATE_ORDER');
handler.setAggregate('ORDER_AGGREGATE', 'CANCEL_ORDER');

commandBus.setHandler('CREATE_ORDER', handler);
commandBus.setHandler('CANCEL_ORDER', handler);

const aggregateId = uuid.v4();
//todo: wait for callback
commandBus.handleCommand({
  aggregateId: aggregateId,
  name: 'chopper',
  type: 'CREATE_ORDER',
  productId: 'p1'
}, (err, res)=> {
  if (err) {
    console.log('find error ', err);
  }
  // console.log('eventStore.aggregateRecords.get(aggregateId).events', eventStore.aggregateRecords.get(aggregateId).events);
  commandBus.handleCommand({
    aggregateId: aggregateId,
    name: 'chopper',
    type: 'CANCEL_ORDER'
  }, (err, res) => {
    if (err) {
      console.log('find error ', err);
    }
    console.log('eventStore.aggregateRecords.get(aggregateId).events', eventStore.aggregateRecords.get(aggregateId).events);
  })
});

