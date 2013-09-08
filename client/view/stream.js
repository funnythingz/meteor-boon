if (Meteor.isClient) {

  Template.stream.messages = function() {
    return MessagesController.findMessages();
  }

}
