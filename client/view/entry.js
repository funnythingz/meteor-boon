if (Meteor.isClient) {

  Template.entry._id = function() {
    return this._id;
  }

  Template.entry.text = function() {
    return this.text;
  }

  Template.entry.liked = function() {
    return this.liked;
  }

  Template.entry.baded = function() {
    return this.baded;
  }

}
