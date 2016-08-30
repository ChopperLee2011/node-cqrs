'use strict';
const cqrs = require('../../');
const uuid = require('uuid');
const InvitationAggregate = require('../domain/aggregate');
const command = require('../domain/commands');

const eventBus = new cqrs.EventBus();
const commandBus = new cqrs.CommandBus();
const eventStore = new cqrs.EventStore(eventBus);
const repository = new cqrs.Repository(eventStore);
// const invatationAggregate = new InvitationAggregate();

repository.registerAggregate('INVITE_AGGREGATE', InvitationAggregate);

const handler = new cqrs.CommandHandler(repository);
handler.setAggregate('INVITE_AGGREGATE', 'CREATE_INVITE');

commandBus.setHandler('CREATE_INVITE', handler);

const invitationId = uuid.v4();
//todo: wait for callback
commandBus.handleCommand({
  aggregateId: invitationId,
  invitationId: invitationId,
  name: 'chopper',
  type: 'CREATE_INVITE'
});

