if (Meteor.isClient) {

  Template.removeAction.events({
    'click .remove' : function (event) {
      MessagesController.removeEntry(this._id);
    },
  });

}
