if (Meteor.isClient) {

  Template.message._id = function() {
    console.log(this);
    return this._id;
  }

  Template.message.text = function() {
    return this.text;
  }

}
