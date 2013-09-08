if (Meteor.isClient) {

  Template.action.events({
    'click .remove' : function (event) {
      MessagesController.removeMessage(this._id);
    },
  });

}
