if (Meteor.isClient) {

  Template.removeAction.events({
    'click .remove' : function (event) {
      EntryController.removeEntry(this._id);
    },
  });

}
