if (Meteor.isClient) {

  Template.removeAction.events({
    'click .remove' : function (event) {
      MessagesController.removeMessage(this._id);
    },
  });

}
