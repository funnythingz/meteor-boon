if (Meteor.isClient) {

  Template.message._id = function() {
    return this._id;
  }

  Template.message.text = function() {
    return this.text;
  }

}
