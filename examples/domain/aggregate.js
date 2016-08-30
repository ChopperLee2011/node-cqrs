'use strict';

const Aggregate = require('../../').Aggregate;

//todo: change to use contant file
const InvitationAggregateType = "Invitation";

class InvitationAggregate extends Aggregate {
  constructor() {
    super();
    this.name;
    this.age;
    this.accepted;
    this.decline;
  }

  handlerCommand(command) {
    switch (command.type) {
      case 'CREATE_INVITE':
        aggregate.storeEvent({
          invitationID: command.invitationId,
          name: command.name,
          age: command.age
        });
        break;
      default:
        break;
    }

  }
}

module.exports = InvitationAggregate;
