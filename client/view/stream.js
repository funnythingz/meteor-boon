if (Meteor.isClient) {

  Template.stream.entries = function() {
    return MessagesController.findEntry();
  }

}
