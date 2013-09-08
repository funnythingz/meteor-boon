if (Meteor.isClient) {

  Template.action.events({
    'click .like' : function (event) {
      EntryController.updateLiked(this._id);
    },
  });

  Template.action.events({
    'click .bad' : function (event) {
      EntryController.updateBaded(this._id);
    },
  });

}
