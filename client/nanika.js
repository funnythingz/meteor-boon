if (Meteor.isClient) {
  Template.body.greeting = function () {
    return "Welcome to nanika.";
  };

  Template.body.events({
    'click input' : function () {
      // template data, if any, is available in 'this'
    }
  });
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
