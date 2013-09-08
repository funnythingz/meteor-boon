if (Meteor.isClient) {

  Template.stream.entries = function() {
    return EntryController.findEntry();
  }

}
